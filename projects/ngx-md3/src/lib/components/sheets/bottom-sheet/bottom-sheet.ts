import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, computed, ElementRef, inject, NgZone, signal, viewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BOTTOM_SHEET_CONFIG } from './bottom-sheet-ref';
import { BottomSheetConfig, BottomSheetContainer } from '../../../interfaces/bottom-sheet-config.interface';

/** Movement shorter than this is still a tap rather than a drag. */
const DRAG_START_THRESHOLD_PX = 4;

/** Part of the sheet's height a drag has to cover for the sheet to be dismissed on release. */
const DISMISS_DISTANCE_RATIO = 0.4;

/** Downward speed, in pixels per millisecond, that dismisses the sheet whatever distance it covered. */
const DISMISS_VELOCITY = 0.5;

/** A release this long after the last move is a stop, so the speed before it no longer counts. */
const VELOCITY_TIMEOUT_MS = 100;

/**
 * Material 3 bottom sheet shell. Like Dialog, it extends the CDK dialog
 * container so focus trapping, focus restoration and the ARIA attributes are
 * handled by the CDK while this component only owns the MD3 surface, its
 * drag handle and the slide-up animation. There is no docked variant: a
 * bottom sheet is always a modal overlay.
 *
 * The shell also owns the drag gesture. Dragging the surface down follows the
 * pointer, and releasing either dismisses the sheet or snaps it back. Since the
 * shell is created before BottomSheetRef exists, it reports the gesture through
 * observables the reference subscribes to instead of closing the sheet itself.
 */
@Component({
    selector: 'md3-bottom-sheet',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './bottom-sheet.html',
    styleUrl: './bottom-sheet.scss',
    host: {
        '[class.md3-hide-handle]': '!showHandle()',
        '[class.md3-draggable]': 'allowGestures()',
        '[class.md3-dragging]': 'isDragging()',
    },
})
export class BottomSheet extends CdkDialogContainer implements BottomSheetContainer {
    private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
    private readonly zone = inject(NgZone);

    private readonly dismissedSheet = new Subject<void>();
    private readonly draggedSheet = new Subject<number>();

    protected readonly config = inject<BottomSheetConfig>(BOTTOM_SHEET_CONFIG, { optional: true }) ?? {};

    public isActive = signal<boolean>(false);
    public readonly showHandle = signal<boolean>(this.config.handle ?? true);
    public readonly allowGestures = signal<boolean>(this.config.gestures ?? true);

    /** How far below its resting position the drag is currently holding the sheet, in pixels. */
    private readonly dragOffset = signal<number>(0);
    protected readonly isDragging = signal<boolean>(false);

    /**
     * Only set while the sheet sits away from its resting position, so the opening and
     * closing transforms in the stylesheet stay in charge the rest of the time.
     */
    protected readonly dragTransform = computed<string | null>(() => {
        const offset = this.dragOffset();

        return offset > 0 ? `translateY(${offset}px)` : null;
    });

    /** Pointer currently dragging the sheet, if there is one. */
    private pointerId?: number;
    /** Scrollable the drag started over, which owns the gesture until it is scrolled to the top. */
    private scroller: HTMLElement | null = null;
    private startY = 0;
    private lastY = 0;
    private lastTimestamp = 0;
    private velocity = 0;
    private isPastThreshold = false;

    public readonly dismissed: Observable<void> = this.dismissedSheet.asObservable();
    public readonly dragProgress: Observable<number> = this.draggedSheet.asObservable();

    public get surfaceElement(): HTMLElement | null {
        return this.surface()?.nativeElement ?? null;
    }

    public startEnterAnimation(): void {
        requestAnimationFrame(() => {
            this.isActive.set(true);
        });
    }

    public setActive(value: boolean): void {
        this.isActive.set(value);
    }

    public recaptureFocus(): void {
        this._recaptureFocus();
    }

    public override ngOnDestroy(): void {
        this.stopTracking();
        super.ngOnDestroy();
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

        this.pointerId = event.pointerId;
        this.startY = this.lastY = event.clientY;
        this.lastTimestamp = event.timeStamp;
        this.velocity = 0;
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

        // Upward movement is clamped: the sheet has a single resting position to return to.
        this.setDragOffset(Math.max(0, event.clientY - this.startY));
    };

    private readonly onPointerUp = (event: PointerEvent): void => {
        if (event.pointerId !== this.pointerId) {
            return;
        }

        const wasDragging = this.isPastThreshold;
        const shouldDismiss = wasDragging && this.shouldDismiss(event.timeStamp);

        if (shouldDismiss) {
            this.releasePointer();
            this.slideOut();
            this.zone.run(() => this.dismissedSheet.next());
        } else {
            this.stopTracking();
        }

        if (wasDragging) {
            this.suppressClickAfterDrag();
        }
    };

    private readonly onPointerCancel = (event: PointerEvent): void => {
        if (event.pointerId === this.pointerId) {
            this.stopTracking();
        }
    };

    /** Keeps the browser from scrolling or overscrolling underneath an ongoing drag. */
    private readonly onTouchMove = (event: TouchEvent): void => {
        if (this.isPastThreshold && event.cancelable) {
            event.preventDefault();
        }
    };

    /**
     * Decides who owns the gesture on the first move that leaves the tap threshold. Upward
     * moves, and downward moves over content that still has somewhere to scroll, belong to
     * the content, so the sheet lets go of them for good.
     */
    private tryStartDrag(event: PointerEvent): boolean {
        const distance = event.clientY - this.startY;

        if (Math.abs(distance) < DRAG_START_THRESHOLD_PX) {
            return false;
        }

        if (distance < 0 || (this.scroller?.scrollTop ?? 0) > 0) {
            this.stopTracking();

            return false;
        }

        // Starting from where the threshold was crossed keeps the sheet from jumping under
        // the pointer on the first frame of the drag.
        this.startY = this.lastY = event.clientY;
        this.isPastThreshold = true;
        this.isDragging.set(true);

        return true;
    }

    private shouldDismiss(timestamp: number): boolean {
        const height = this.surfaceElement?.offsetHeight ?? 0;
        const isFling = timestamp - this.lastTimestamp < VELOCITY_TIMEOUT_MS
            && this.velocity > DISMISS_VELOCITY;

        return isFling || (height > 0 && this.dragOffset() > height * DISMISS_DISTANCE_RATIO);
    }

    private setDragOffset(offset: number): void {
        const height = this.surfaceElement?.offsetHeight ?? 0;

        this.dragOffset.set(offset);
        this.draggedSheet.next(height > 0 ? Math.min(1, offset / height) : 0);
    }

    /**
     * Sees the drag out of the viewport rather than back to the resting position, so a
     * dismissed sheet keeps going the way it was dragged instead of springing back first.
     * The fade comes from the exit animation BottomSheetRef starts right after.
     */
    private slideOut(): void {
        this.dragOffset.set(this.surfaceElement?.offsetHeight ?? this.dragOffset());
    }

    /** Releases the pointer and puts the sheet back at its resting position. */
    private stopTracking(): void {
        this.releasePointer();

        if (this.dragOffset() !== 0) {
            this.setDragOffset(0);
        }
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
