import { Component, computed, effect, ElementRef, inject, input, NgZone, signal, viewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
    BottomSheetState,
    BottomSheetSurfaceHost,
    BottomSheetType,
} from '../../../interfaces/bottom-sheet-config.interface';
import { DRAG_START_THRESHOLD_PX, settleTarget } from './bottom-sheet-snap';

/**
 * The MD3 bottom sheet surface: the rounded panel, its drag handle and the gesture that moves
 * it. Both shells wrap this — the modal one inside a CDK dialog container, the standard one
 * inside a scaffold outlet — and project their own portal outlet into it, which is what lets
 * the CDK keep the outlet in its own template while the markup lives here once.
 *
 * The surface reports gestures through observables instead of acting on them, because it is
 * created before the sheet's reference exists and cannot reach it through DI.
 */
@Component({
    selector: 'md3-bottom-sheet-surface',
    imports: [],
    templateUrl: './bottom-sheet-surface.html',
    styleUrl: './bottom-sheet-surface.scss',
    host: {
        '[class.md3-mode-standard]': 'mode() === "standard"',
        '[class.md3-mode-modal]': 'mode() === "modal"',
        '[class.md3-hide-handle]': '!showHandle()',
        '[class.md3-draggable]': 'allowGestures()',
        '[class.md3-dragging]': 'isDragging()',
        '[class.md3-expanded]': 'state() === "expanded"',
    },
})
export class BottomSheetSurface implements BottomSheetSurfaceHost {
    private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
    private readonly zone = inject(NgZone);
    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    private readonly dismissedSheet = new Subject<void>();
    private readonly draggedSheet = new Subject<number>();
    private readonly settledSheet = new Subject<BottomSheetState>();

    public readonly mode = input<BottomSheetType>('modal');
    public readonly showHandle = input<boolean>(true);
    public readonly allowGestures = input<boolean>(true);
    public readonly dismissible = input<boolean>(false);
    public readonly initialState = input<BottomSheetState>('collapsed');
    public readonly scheme = input<'inherit' | 'dark' | 'light'>('inherit');
    public readonly direction = input<null | 'ltr' | 'rtl'>(null);
    public readonly handleLabel = input<string>('Resize sheet');
    public readonly controlsId = input<string>('');

    protected readonly isActive = signal<boolean>(false);
    protected readonly isDragging = signal<boolean>(false);

    /** How far below the fully expanded position the sheet currently sits, in pixels. */
    private readonly dragOffset = signal<number>(0);

    /**
     * Snap offsets in pixels, ascending: expanded, then collapsed for a standard sheet, then
     * dismissed where dragging that far is allowed. Measured rather than derived from the
     * configured CSS lengths, so `em`, `dvh` and the rest resolve themselves.
     */
    private readonly snapPoints = signal<number[]>([0]);
    private readonly settledIndex = signal<number>(0);

    public readonly state = computed<BottomSheetState>(() => {
        return this.settledIndex() === 0 ? 'expanded' : 'collapsed';
    });

    protected readonly isHandleInteractive = computed<boolean>(() => {
        return this.mode() === 'standard' && this.allowGestures() && this.showHandle();
    });

    /**
     * Only set when a drag has to be seen out past where the stylesheet would leave the sheet,
     * so the exit carries on the way the drag was going instead of doubling back.
     */
    private readonly exitTransform = signal<string | null>(null);

    /**
     * Left to the stylesheet unless the component has a position of its own to impose — a drag
     * in progress, or the resting offset of a collapsed standard sheet. The closed and fully
     * open positions stay in CSS so they apply as soon as the element is inserted, which is
     * what the enter transition needs to have somewhere to run from.
     */
    protected readonly surfaceTransform = computed<string | null>(() => {
        if (!this.isActive()) {
            return this.exitTransform();
        }

        const offset = this.dragOffset();

        return offset > 0 ? `translateY(${offset}px)` : null;
    });

    /** Pointer currently dragging the sheet, if there is one. */
    private pointerId?: number;
    /** Scrollable the drag started over, which owns the gesture while it has room to scroll. */
    private scroller: HTMLElement | null = null;
    private startY = 0;
    private lastY = 0;
    private lastTimestamp = 0;
    private velocity = 0;
    private originOffset = 0;
    private isPastThreshold = false;
    /** Set once the sheet is on its way out, so a late resize cannot pull it back into view. */
    private isExiting = false;

    public readonly dismissed: Observable<void> = this.dismissedSheet.asObservable();
    public readonly dragProgress: Observable<number> = this.draggedSheet.asObservable();
    public readonly stateChanges: Observable<BottomSheetState> = this.settledSheet.asObservable();

    constructor() {
        effect(() => {
            if (this.mode() === 'standard') {
                this.exitTransform.set('translateY(100%)');
            }
        });

        // Heights are CSS lengths, so anything that resizes the surface — a viewport change, a
        // new expanded height — moves the snap points with it and the sheet has to settle again.
        effect((onCleanup) => {
            const surface = this.el.nativeElement;
            const observer = new ResizeObserver(() => this.remeasure());

            observer.observe(surface);

            onCleanup(() => observer.disconnect());
        });
    }

    public get surfaceElement(): HTMLElement | null {
        return this.surface()?.nativeElement ?? null;
    }

    public startEnterAnimation(): void {
        requestAnimationFrame(() => {
            this.measure();

            // A modal sheet has one resting height, so only a standard sheet can open collapsed.
            const opensCollapsed = this.mode() === 'standard' && this.initialState() === 'collapsed';

            this.snapTo(opensCollapsed ? this.collapsedIndex() : 0, false);
            this.isActive.set(true);
        });
    }

    public setActive(value: boolean): void {
        if (!value) {
            this.isExiting = true;
        }

        this.isActive.set(value);
    }

    public expand(): void {
        this.snapTo(0);
    }

    public collapse(): void {
        this.snapTo(this.collapsedIndex());
    }

    public toggle(): void {
        if (this.state() === 'expanded') {
            this.collapse();
        } else {
            this.expand();
        }
    }

    public destroy(): void {
        this.releasePointer();
    }

    protected onHandleKeydown(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.expand();
        }

        // Collapsing is as far as the keyboard goes, even when a drag could dismiss the sheet:
        // there is no undo for a dismissal reached by arrow key.
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.collapse();
        }
    }

    protected onPointerDown(event: PointerEvent): void {
        // Only the first pointer down drags: a second finger, or a mouse button other than
        // the primary one, leaves context menus and multi-touch alone.
        if (!this.allowGestures() || this.pointerId !== undefined || !event.isPrimary) {
            return;
        }

        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        this.measure();

        this.pointerId = event.pointerId;
        this.startY = this.lastY = event.clientY;
        this.lastTimestamp = event.timeStamp;
        this.velocity = 0;
        this.originOffset = this.dragOffset();
        this.isPastThreshold = false;
        this.scroller = this.findScroller(event.target);

        // Tracking a drag at pointer rate has nothing to tell the rest of the application,
        // and the signals it writes schedule their own change detection.
        this.zone.runOutsideAngular(() => {
            this.surfaceElement?.addEventListener('touchmove', this.onTouchMove, { passive: false });
            window.addEventListener('pointermove', this.onPointerMove);
            window.addEventListener('pointerup', this.onPointerUp);
            window.addEventListener('pointercancel', this.onPointerCancel);
        });
    }

    private readonly onPointerMove = (event: PointerEvent): void => {
        if (event.pointerId !== this.pointerId) {
            return;
        }

        if (!this.isPastThreshold && !this.tryStartDrag(event)) {
            return;
        }

        const elapsed = event.timeStamp - this.lastTimestamp;

        if (elapsed > 0) {
            this.velocity = (event.clientY - this.lastY) / elapsed;
            this.lastY = event.clientY;
            this.lastTimestamp = event.timeStamp;
        }

        this.setDragOffset(this.clampToRange(this.originOffset + event.clientY - this.startY));
    };

    private readonly onPointerUp = (event: PointerEvent): void => {
        if (event.pointerId !== this.pointerId) {
            return;
        }

        if (!this.isPastThreshold) {
            this.releasePointer();

            return;
        }

        const points = this.snapPoints();
        const target = settleTarget({
            points,
            origin: this.originOffset,
            offset: this.dragOffset(),
            velocity: this.velocity,
            idleTime: event.timeStamp - this.lastTimestamp,
        });

        this.releasePointer();

        if (target === this.dismissIndex()) {
            this.slideOut(points[target]);
            this.zone.run(() => this.dismissedSheet.next());
        } else {
            this.snapTo(target);
        }

        this.suppressClickAfterDrag();
    };

    private readonly onPointerCancel = (event: PointerEvent): void => {
        if (event.pointerId === this.pointerId) {
            const wasDragging = this.isPastThreshold;

            this.releasePointer();

            if (wasDragging) {
                this.snapTo(this.settledIndex());
            }
        }
    };

    /** Keeps the browser from scrolling or overscrolling underneath an ongoing drag. */
    private readonly onTouchMove = (event: TouchEvent): void => {
        if (this.isPastThreshold && event.cancelable) {
            event.preventDefault();
        }
    };

    /**
     * Decides who owns the gesture on the first move that leaves the tap threshold. Downward
     * moves over content that still has somewhere to scroll belong to the content, and so do
     * upward moves once the sheet is already as far up as it goes — in both cases the sheet
     * lets go of the gesture for good.
     */
    private tryStartDrag(event: PointerEvent): boolean {
        const distance = event.clientY - this.startY;

        if (Math.abs(distance) < DRAG_START_THRESHOLD_PX) {
            return false;
        }

        const isDownward = distance > 0;
        const isBlocked = isDownward
            ? (this.scroller?.scrollTop ?? 0) > 0
            : this.dragOffset() <= this.snapPoints()[0];

        if (isBlocked) {
            this.releasePointer();

            return false;
        }

        // Starting from where the threshold was crossed keeps the sheet from jumping under
        // the pointer on the first frame of the drag.
        this.startY = this.lastY = event.clientY;
        this.isPastThreshold = true;
        this.isDragging.set(true);

        return true;
    }

    /** Re-reads the geometry the snap points are derived from. */
    private measure(): void {
        const expanded = this.el.nativeElement.offsetHeight;

        if (expanded <= 0) {
            return;
        }

        if (this.mode() === 'modal') {
            this.snapPoints.set([0, expanded]);

            return;
        }

        // The peek strip a standard sheet reserves is the height of the element it was placed
        // in — the standard shell's host, which the scaffold row sizes to the collapsed height.
        // Measuring beats resolving the configured CSS length by hand.
        const collapsed = this.el.nativeElement.parentElement?.getBoundingClientRect().height ?? expanded;
        const points = [0, Math.max(0, expanded - collapsed)];

        if (this.dismissible()) {
            points.push(expanded);
        }

        this.snapPoints.set(points);
    }

    /** Settles the sheet again after its geometry moved underneath it. */
    public remeasure(): void {
        if (this.pointerId !== undefined || this.isExiting) {
            return;
        }

        this.measure();

        const points = this.snapPoints();
        const index = Math.min(this.settledIndex(), points.length - 1);

        this.settledIndex.set(index);
        this.dragOffset.set(points[index]);
    }

    private snapTo(index: number, notify: boolean = true): void {
        const points = this.snapPoints();
        const target = Math.min(Math.max(index, 0), points.length - 1);
        const previous = this.state();

        this.settledIndex.set(target);
        this.setDragOffset(points[target]);

        if (notify && this.state() !== previous) {
            this.zone.run(() => this.settledSheet.next(this.state()));
        }
    }

    /**
     * Sees the drag out of the viewport rather than back to a snap point, so a dismissed sheet
     * keeps going the way it was dragged. The fade comes from the exit animation the sheet's
     * reference starts right after, which finds the surface already on its way out.
     */
    private slideOut(offset: number): void {
        this.isExiting = true;
        this.exitTransform.set(`translateY(${offset}px)`);
        this.setDragOffset(offset);
    }

    private setDragOffset(offset: number): void {
        const dismissOffset = this.snapPoints()[this.dismissIndex() ?? -1];

        this.dragOffset.set(offset);
        this.draggedSheet.next(dismissOffset > 0 ? Math.min(1, offset / dismissOffset) : 0);
    }

    /** Index a drag has to reach for the sheet to be dismissed, when it can be at all. */
    private dismissIndex(): number | undefined {
        if (this.mode() === 'modal') {
            return 1;
        }

        return this.dismissible() ? this.snapPoints().length - 1 : undefined;
    }

    private collapsedIndex(): number {
        return Math.min(1, this.snapPoints().length - 1);
    }

    private clampToRange(offset: number): number {
        const points = this.snapPoints();

        return Math.min(Math.max(offset, points[0]), points[points.length - 1]);
    }

    private releasePointer(): void {
        if (this.pointerId === undefined) {
            return;
        }

        this.pointerId = undefined;
        this.isPastThreshold = false;
        this.scroller = null;
        this.isDragging.set(false);

        this.surfaceElement?.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('pointercancel', this.onPointerCancel);
    }

    /**
     * A drag that ended over a button would otherwise still click it, so the click that
     * follows the release is swallowed. Nothing else fires in between, and the listener is
     * dropped right after in case the release happened over something unclickable.
     */
    private suppressClickAfterDrag(): void {
        const surface = this.surfaceElement;

        if (!surface) {
            return;
        }

        const onClick = (event: MouseEvent): void => {
            event.preventDefault();
            event.stopPropagation();
        };

        surface.addEventListener('click', onClick, { capture: true, once: true });
        setTimeout(() => surface.removeEventListener('click', onClick, { capture: true }));
    }

    /** Nearest scrollable between the pointer and the surface, if the drag started over one. */
    private findScroller(target: EventTarget | null): HTMLElement | null {
        const surface = this.surfaceElement;
        let node = target instanceof HTMLElement ? target : null;

        while (node && surface?.contains(node)) {
            if (node.scrollHeight > node.clientHeight && this.isScrollable(node)) {
                return node;
            }

            node = node.parentElement;
        }

        return null;
    }

    private isScrollable(element: HTMLElement): boolean {
        const overflowY = getComputedStyle(element).overflowY;

        return overflowY === 'auto' || overflowY === 'scroll';
    }
}
