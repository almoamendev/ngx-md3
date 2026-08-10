import { DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken, Type } from '@angular/core';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { BottomSheetConfig, BottomSheetContainer } from '../../../interfaces/bottom-sheet-config.interface';

export const BOTTOM_SHEET_DATA = new InjectionToken<unknown>('MD3_BOTTOM_SHEET_DATA');
export const BOTTOM_SHEET_CONFIG = new InjectionToken<BottomSheetConfig>('MD3_BOTTOM_SHEET_CONFIG');
export const BOTTOM_SHEET_COMPONENT = new InjectionToken<Type<unknown>>('MD3_BOTTOM_SHEET_COMPONENT');

const BOTTOM_SHEET_EXIT_ANIMATION_FALLBACK_MS = 300;
const BOTTOM_SHEET_DRAGGING_CLASS = 'md3-bottom-sheet-dragging';

/**
 * A bottom sheet is a single modal overlay, not a stack like dialogs can be,
 * so this is a smaller version of DialogRef: no hide/show, no full screen
 * variant, closing is always the only way out.
 */
export class BottomSheetRef<T = unknown, R = unknown> {
    private readonly closed = new Subject<R | undefined>();
    private closeStarted = false;
    private closeSettled = false;

    /** Shell hosting the sheet. Filled by BottomSheetService once it is created. */
    public sheetInstance?: BottomSheetContainer;
    /** Filled by BottomSheetService after the sheet component is attached. */
    public componentInstance?: T;

    /** Overlay hosting the sheet, useful to reach the panel and the scrim. */
    public get overlayRef(): OverlayRef {
        return this.cdkRef.overlayRef;
    }

    /** Whether the sheet started closing. */
    public get isClosing(): boolean {
        return this.closeStarted;
    }

    constructor(
        private readonly cdkRef: CdkDialogRef<R, T>,
    ) {
        this.cdkRef.closed.pipe(take(1)).subscribe((result) => this.settle(result));
        this.connectCloseEvents();
    }

    /** Closes the sheet. The promise resolves once the exit animation is done. */
    public close(result?: R): Promise<void> {
        if (this.closeStarted) {
            return Promise.resolve();
        }

        this.closeStarted = true;

        return this.startCloseAnimation().then(() => this.cdkRef.close(result));
    }

    public afterClosed(): Observable<R | undefined> {
        return this.closed.asObservable();
    }

    /**
     * Wires the shell to this reference. Called by BottomSheetService, since the shell is
     * created by the CDK before this reference exists and cannot reach it through DI.
     */
    public attachContainer(container: BottomSheetContainer): void {
        this.sheetInstance = container;

        container.dismissed.pipe(take(1)).subscribe(() => this.close());
        container.dragProgress.pipe(
            takeUntil(this.closed),
        ).subscribe((progress) => this.trackDragProgress(progress));
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

    private startCloseAnimation(): Promise<void> {
        const overlayRef = this.cdkRef.overlayRef;

        // Closing during a drag, from the Escape key for instance, leaves the scrim held
        // where the drag left it, so it is handed back to CSS before the exit animation.
        overlayRef.backdropElement?.classList.remove(BOTTOM_SHEET_DRAGGING_CLASS);
        overlayRef.backdropElement?.style.removeProperty('--md3-drag-remaining');

        overlayRef.overlayElement.classList.add('md3-bottom-sheet-closing');
        overlayRef.backdropElement?.classList.add('md3-bottom-sheet-closing');
        this.sheetInstance?.setActive(false);

        return this.waitForSurfaceAnimation();
    }

    /** Resolves when the surface finished animating, with a timeout as a safety net. */
    private waitForSurfaceAnimation(): Promise<void> {
        const panel = this.cdkRef.overlayRef.overlayElement;
        const surface = this.sheetInstance?.surfaceElement ?? panel;

        return new Promise((resolve) => {
            let isResolved = false;
            const timeoutId = setTimeout(done, BOTTOM_SHEET_EXIT_ANIMATION_FALLBACK_MS);

            function done(): void {
                if (isResolved) {
                    return;
                }

                isResolved = true;
                clearTimeout(timeoutId);
                surface.removeEventListener('transitionend', onTransitionEnd);
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

    /** Emits the result once the CDK reference is closed. Focus is restored by the container. */
    private settle(result?: R): void {
        if (this.closeSettled) {
            return;
        }

        this.closeStarted = true;
        this.closeSettled = true;
        this.closed.next(result);
        this.closed.complete();
    }
}
