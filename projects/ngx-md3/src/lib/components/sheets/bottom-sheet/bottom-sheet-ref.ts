import { DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, InjectionToken, signal, Signal, Type } from '@angular/core';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import {
    BottomSheetConfig,
    BottomSheetState,
    BottomSheetSurfaceHost,
    StandardBottomSheetHost,
} from '../../../interfaces/bottom-sheet-config.interface';

export const BOTTOM_SHEET_DATA = new InjectionToken<unknown>('MD3_BOTTOM_SHEET_DATA');
export const BOTTOM_SHEET_CONFIG = new InjectionToken<BottomSheetConfig>('MD3_BOTTOM_SHEET_CONFIG');
export const BOTTOM_SHEET_COMPONENT = new InjectionToken<Type<unknown>>('MD3_BOTTOM_SHEET_COMPONENT');

/** Long enough to outlast the surface transition, which the transitionend listener usually beats. */
const BOTTOM_SHEET_EXIT_ANIMATION_FALLBACK_MS = 600;
const BOTTOM_SHEET_DRAGGING_CLASS = 'md3-bottom-sheet-dragging';

/** A modal sheet has one height, so it reports the same state a standard sheet does when open. */
const ALWAYS_EXPANDED: Signal<BottomSheetState> = signal<BottomSheetState>('expanded').asReadonly();

/**
 * What both kinds of bottom sheet have in common: closing once, animating out before the shell
 * goes away, and reporting the result. The two shells differ in what they are hosted by — a CDK
 * overlay or a scaffold outlet — so each subclass owns its own exit and teardown.
 *
 * This class stays the DI token, so a component written for one kind of sheet can be opened as
 * the other without changing how it injects its reference.
 */
export abstract class BottomSheetRef<T = unknown, R = unknown> {
    protected readonly closed = new Subject<R | undefined>();
    protected closeStarted = false;
    private closeSettled = false;

    /** Surface hosting the sheet. Filled in by BottomSheetService once the shell is created. */
    public sheetInstance?: BottomSheetSurfaceHost;
    /** Filled by BottomSheetService after the sheet component is attached. */
    public componentInstance?: T;

    /** Whether the sheet started closing. */
    public get isClosing(): boolean {
        return this.closeStarted;
    }

    /** Height the sheet is resting at. A modal sheet is only ever fully open. */
    public get state(): Signal<BottomSheetState> {
        return ALWAYS_EXPANDED;
    }

    /** Closes the sheet. The promise resolves once the exit animation is done. */
    public close(result?: R): Promise<void> {
        if (this.closeStarted) {
            return Promise.resolve();
        }

        this.closeStarted = true;

        return this.startCloseAnimation().then(() => this.finishClose(result));
    }

    public afterClosed(): Observable<R | undefined> {
        return this.closed.asObservable();
    }

    /**
     * Wires the shell to this reference. Called by BottomSheetService, since the shell is
     * created before this reference exists and cannot reach it through DI.
     */
    public attachContainer(container: BottomSheetSurfaceHost): void {
        this.sheetInstance = container;

        container.dismissed.pipe(take(1)).subscribe(() => this.close());
    }

    /** Moves a standard sheet to its expanded height. Modal sheets have only one height. */
    public expand(): void {
    }

    /** Moves a standard sheet back to its collapsed height. */
    public collapse(): void {
    }

    /** Switches a standard sheet between its two heights. */
    public toggle(): void {
    }

    public setCollapsedHeight(height: number | string): void {
    }

    public setExpandedHeight(height: number | string): void {
    }

    public setDismissible(value: boolean): void {
    }

    protected abstract startCloseAnimation(): Promise<void>;

    protected abstract finishClose(result?: R): void;

    /** Resolves when the surface finished animating, with a timeout as a safety net. */
    protected waitForSurfaceAnimation(fallback?: HTMLElement | null): Promise<void> {
        const surface = this.sheetInstance?.surfaceElement ?? fallback ?? null;

        if (!surface) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let isResolved = false;
            const timeoutId = setTimeout(done, BOTTOM_SHEET_EXIT_ANIMATION_FALLBACK_MS);

            function done(): void {
                if (isResolved) {
                    return;
                }

                isResolved = true;
                clearTimeout(timeoutId);
                surface!.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }

            function onTransitionEnd(event: TransitionEvent): void {
                if (event.target === surface) {
                    done();
                }
            }

            surface.addEventListener('transitionend', onTransitionEnd);
        });
    }

    /** Emits the result once the sheet is gone. */
    protected settle(result?: R): void {
        if (this.closeSettled) {
            return;
        }

        this.closeStarted = true;
        this.closeSettled = true;
        this.closed.next(result);
        this.closed.complete();
    }
}

/**
 * A modal bottom sheet is a single overlay, not a stack like dialogs can be, so this is a
 * smaller version of DialogRef: no hide/show, no full screen variant, closing is always the
 * only way out.
 */
export class ModalBottomSheetRef<T = unknown, R = unknown> extends BottomSheetRef<T, R> {
    constructor(
        private readonly cdkRef: CdkDialogRef<R, T>,
    ) {
        super();

        this.cdkRef.closed.pipe(take(1)).subscribe((result) => this.settle(result));
        this.connectCloseEvents();
    }

    /** Overlay hosting the sheet, useful to reach the panel and the scrim. */
    public get overlayRef(): OverlayRef {
        return this.cdkRef.overlayRef;
    }

    public override attachContainer(container: BottomSheetSurfaceHost): void {
        super.attachContainer(container);

        container.dragProgress.pipe(
            takeUntil(this.closed),
        ).subscribe((progress) => this.trackDragProgress(progress));
    }

    protected startCloseAnimation(): Promise<void> {
        const overlayRef = this.cdkRef.overlayRef;

        // Closing during a drag, from the Escape key for instance, leaves the scrim held
        // where the drag left it, so it is handed back to CSS before the exit animation.
        overlayRef.backdropElement?.classList.remove(BOTTOM_SHEET_DRAGGING_CLASS);
        overlayRef.backdropElement?.style.removeProperty('--md3-drag-remaining');

        overlayRef.overlayElement.classList.add('md3-bottom-sheet-closing');
        overlayRef.backdropElement?.classList.add('md3-bottom-sheet-closing');
        this.sheetInstance?.setActive(false);

        return this.waitForSurfaceAnimation(overlayRef.overlayElement);
    }

    protected finishClose(result?: R): void {
        this.cdkRef.close(result);
    }

    private connectCloseEvents(): void {
        // The CDK config keeps `disableClose` on, so the scrim and Escape key
        // are handled here instead and the sheet can animate out.
        this.cdkRef.backdropClick.pipe(take(1)).subscribe(() => this.close());

        this.cdkRef.keydownEvents.pipe(
            filter((event) => event.key === 'Escape' && !hasModifierKey(event)),
            take(1),
        ).subscribe((event) => {
            event.preventDefault();
            this.close();
        });
    }

    /** Fades the scrim along with the sheet being dragged, and hands it back to CSS on release. */
    private trackDragProgress(progress: number): void {
        const backdrop = this.cdkRef.overlayRef.backdropElement;

        if (!backdrop || this.closeStarted) {
            return;
        }

        if (progress <= 0) {
            backdrop.classList.remove(BOTTOM_SHEET_DRAGGING_CLASS);
            backdrop.style.removeProperty('--md3-drag-remaining');

            return;
        }

        backdrop.classList.add(BOTTOM_SHEET_DRAGGING_CLASS);
        backdrop.style.setProperty('--md3-drag-remaining', `${1 - progress}`);
    }
}

/**
 * A standard bottom sheet lives in a scaffold outlet rather than an overlay, so there is no
 * scrim to fade and nothing to dispose but the component itself. In exchange it can be moved
 * between its two heights while it is open.
 */
export class StandardBottomSheetRef<T = unknown, R = unknown> extends BottomSheetRef<T, R> {
    private sheetComponentRef?: ComponentRef<unknown>;
    private host?: StandardBottomSheetHost;

    constructor(
        private readonly onClosed: () => void,
    ) {
        super();
    }

    public override get state(): Signal<BottomSheetState> {
        return this.host?.state ?? ALWAYS_EXPANDED;
    }

    /** Called by BottomSheetService once the shell has been created in the outlet. */
    public attachSheet(componentRef: ComponentRef<unknown>, host: StandardBottomSheetHost): void {
        this.sheetComponentRef = componentRef;
        this.host = host;

        this.attachContainer(host);
    }

    public override expand(): void {
        this.host?.expand();
    }

    public override collapse(): void {
        this.host?.collapse();
    }

    public override toggle(): void {
        this.host?.toggle();
    }

    public override setCollapsedHeight(height: number | string): void {
        this.host?.setCollapsedHeight(height);
    }

    public override setExpandedHeight(height: number | string): void {
        this.host?.setExpandedHeight(height);
    }

    public override setDismissible(value: boolean): void {
        this.host?.setDismissible(value);
    }

    /**
     * Tears the sheet down without an exit animation, for when the outlet holding it is going
     * away and there is nothing left to animate in.
     */
    public dispose(result?: R): void {
        if (this.closeStarted && !this.sheetComponentRef) {
            return;
        }

        this.closeStarted = true;
        this.finishClose(result);
    }

    protected startCloseAnimation(): Promise<void> {
        this.sheetInstance?.setActive(false);

        return this.waitForSurfaceAnimation();
    }

    protected finishClose(result?: R): void {
        this.sheetComponentRef?.destroy();
        this.sheetComponentRef = undefined;
        this.host = undefined;
        this.onClosed();
        this.settle(result);
    }
}
