import { DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken, Type } from '@angular/core';
import { filter, Observable, Subject, take } from 'rxjs';
import { DialogConfig, DialogContainer } from '../../interfaces/dialog-config.interface';

export const DIALOG_DATA = new InjectionToken<unknown>('MD3_DIALOG_DATA');
export const DIALOG_CONFIG = new InjectionToken<DialogConfig>('MD3_DIALOG_CONFIG');
export const DIALOG_COMPONENT = new InjectionToken<Type<unknown>>('MD3_DIALOG_COMPONENT');

const DIALOG_EXIT_ANIMATION_FALLBACK_MS = 300;
const HIDDEN_CLASS = 'md3-dialog-hidden';

export class DialogRef<T = unknown, R = unknown> {
    private readonly closed = new Subject<R | undefined>();
    private readonly closing = new Subject<void>();
    private readonly hiddenChanges = new Subject<boolean>();
    private closePromise: Promise<void> | null = null;
    private closeStarted = false;
    private closeSettled = false;
    private hidden = false;

    /** Shell hosting the dialog: the regular dialog or the full screen one. */
    public dialogInstance?: DialogContainer;
    /**
     * Filled by DialogService after the user component is attached. Keeping the
     * instance here lets callers imperatively update inputs when that is useful.
     */
    public componentInstance?: T;

    /** Overlay hosting the dialog, useful to reach the panel and the scrim. */
    public get overlayRef(): OverlayRef {
        return this.cdkRef.overlayRef;
    }

    /** Whether the dialog started closing. Such a dialog cannot be hidden or shown anymore. */
    public get isClosing(): boolean {
        return this.closeStarted;
    }

    /** Whether the dialog is currently hidden, on request or behind another dialog. */
    public get isHidden(): boolean {
        return this.hidden;
    }

    constructor(
        private readonly cdkRef: CdkDialogRef<R, T>,
        disableCloseEvents: boolean,
        /** Whether this reference belongs to a full screen dialog. */
        public readonly isFullScreen: boolean = false,
    ) {
        // Closing always goes through this reference so the exit animation can
        // run before the CDK disposes the overlay. Detachments triggered from
        // the outside (navigation, scroll strategy) still settle this ref.
        this.cdkRef.closed.pipe(take(1)).subscribe((result) => this.settle(result));

        if (!disableCloseEvents) {
            this.connectCloseEvents();
        }
    }

    /** Closes the dialog. The promise resolves once the exit animation is done. */
    public close(result?: R): Promise<void> {
        if (this.closePromise) {
            return this.closePromise;
        }

        this.startClosing();
        this.closePromise = this.startCloseAnimation().then(() => this.cdkRef.close(result));

        return this.closePromise;
    }

    /**
     * Hides the dialog with the closing animation while keeping it alive, so
     * its content, form state and subscriptions survive until show() is called.
     * The page underneath becomes usable again while the dialog waits behind it.
     * The promise resolves once the dialog is out of sight.
     */
    public hide(): Promise<void> {
        if (this.hidden || this.closeStarted) {
            return Promise.resolve();
        }

        this.hidden = true;
        this.toggleHiddenState(true);
        this.dialogInstance?.setActive(false);
        this.hiddenChanges.next(true);

        return this.waitForSurfaceAnimation();
    }

    /**
     * Brings a hidden dialog back with the opening animation. Focus moves back
     * into the dialog even when it was never hidden, which is what makes it
     * usable again once the dialog above it closes.
     */
    public show(): void {
        if (this.closeStarted) {
            return;
        }

        if (this.hidden) {
            this.hidden = false;
            this.toggleHiddenState(false);
            this.dialogInstance?.setActive(true);
            this.hiddenChanges.next(false);
        }

        this.dialogInstance?.recaptureFocus();
    }

    /** Emits when the dialog starts closing, before the exit animation runs. */
    public beforeClosed(): Observable<void> {
        return this.closing.asObservable();
    }

    /** Emits the new value of `isHidden` every time the dialog is hidden or shown. */
    public hiddenChanged(): Observable<boolean> {
        return this.hiddenChanges.asObservable();
    }

    public afterClosed(): Observable<R | undefined> {
        return this.closed.asObservable();
    }

    private connectCloseEvents(): void {
        // The CDK config keeps `disableClose` on, so the scrim and Escape key
        // are handled here instead and the dialog can animate out.
        this.cdkRef.backdropClick.pipe(take(1)).subscribe(() => {
            this.cdkRef.containerInstance._closeInteractionType = 'mouse';
            this.close();
        });

        // A hidden dialog is not the one the Escape key is meant for, even
        // though the overlay it sits in is still the one receiving the event.
        this.cdkRef.keydownEvents.pipe(
            filter((event) => !this.hidden && event.key === 'Escape' && !hasModifierKey(event)),
            take(1),
        ).subscribe((event) => {
            event.preventDefault();
            this.cdkRef.containerInstance._closeInteractionType = 'keyboard';
            this.close();
        });
    }

    private toggleHiddenState(isHidden: boolean): void {
        const overlayRef = this.cdkRef.overlayRef;
        const panel = overlayRef.overlayElement;
        const backdrop = overlayRef.backdropElement;

        panel.classList.toggle(HIDDEN_CLASS, isHidden);
        backdrop?.classList.toggle(HIDDEN_CLASS, isHidden);

        // `inert` keeps a hidden dialog out of the tab order and away from
        // assistive technology without removing it from the DOM.
        if (isHidden) {
            panel.setAttribute('inert', '');
        } else {
            panel.removeAttribute('inert');
        }
    }

    private startClosing(): void {
        if (this.closeStarted) {
            return;
        }

        this.closeStarted = true;
        this.closing.next();
        this.closing.complete();
    }

    private startCloseAnimation(): Promise<void> {
        const overlayRef = this.cdkRef.overlayRef;
        const wasVisible = !this.hidden;

        overlayRef.overlayElement.classList.add('md3-dialog-closing');
        overlayRef.backdropElement?.classList.add('md3-dialog-closing');
        this.dialogInstance?.setActive(false);

        // A hidden dialog already played the exit animation, so there is
        // nothing left to transition and it can be disposed right away.
        return wasVisible ? this.waitForSurfaceAnimation() : Promise.resolve();
    }

    /** Resolves when the surface finished animating, with a timeout as a safety net. */
    private waitForSurfaceAnimation(): Promise<void> {
        const panel = this.cdkRef.overlayRef.overlayElement;
        const surface = this.dialogInstance?.surfaceElement ?? panel;

        return new Promise((resolve) => {
            let isResolved = false;
            let timeoutId = setTimeout(done, DIALOG_EXIT_ANIMATION_FALLBACK_MS);

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

        // Covers detachments that did not go through close(), so anything
        // waiting on beforeClosed() is still notified.
        this.startClosing();
        this.closeSettled = true;
        this.hiddenChanges.complete();
        this.closed.next(result);
        this.closed.complete();
    }
}
