import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DialogConfig } from '../../interfaces/dialog-config.interface';
import { Dialog } from './dialog';

export const DIALOG_DATA = new InjectionToken<unknown>('MD3_DIALOG_DATA');
export const DIALOG_CONFIG = new InjectionToken<DialogConfig>('MD3_DIALOG_CONFIG');
export const DIALOG_COMPONENT = new InjectionToken<Type<unknown>>('MD3_DIALOG_COMPONENT');

const DIALOG_EXIT_ANIMATION_FALLBACK_MS = 300;

export class DialogRef<T = unknown, R = unknown> {
    private readonly closed = new Subject<R | undefined>();
    private isClosed = false;

    public dialogInstance?: Dialog;
    /**
     * Filled by DialogService after the user component is attached. Keeping the
     * instance here lets callers imperatively update inputs when that is useful.
     */
    public componentInstance?: T;

    constructor(
        private readonly overlayRef: OverlayRef,
        private readonly previouslyFocusedElement: HTMLElement | null
    ) {
    }

    public close(result?: R): void {
        if (this.isClosed) {
            return;
        }

        this.isClosed = true;
        this.startCloseAnimation().then(() => {
            // Disposing the overlay removes the wrapper, the backdrop, and the
            // dynamically attached content component in one operation.
            this.overlayRef.dispose();

            this.previouslyFocusedElement?.focus();

            this.closed.next(result);
            this.closed.complete();
        });
    }

    private startCloseAnimation(): Promise<void> {
        let panel = this.overlayRef.overlayElement;
        let backdrop = this.overlayRef.backdropElement;
        let animatedElement = panel.querySelector<HTMLElement>('.md3-dialog-container') ?? panel;

        panel.classList.add('md3-dialog-closing');
        backdrop?.classList.add('md3-dialog-closing');
        this.dialogInstance?.isActive.set(false);

        return new Promise((resolve) => {
            let isResolved = false;
            let timeoutId = setTimeout(done, DIALOG_EXIT_ANIMATION_FALLBACK_MS);

            function done(): void {
                if (isResolved) {
                    return;
                }

                isResolved = true;
                clearTimeout(timeoutId);
                animatedElement.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            }

            function onTransitionEnd(event: TransitionEvent): void {
                if (event.target === animatedElement) {
                    done();
                }
            }

            animatedElement.addEventListener('transitionend', onTransitionEnd);
        });
    }

    public afterClosed(): Observable<R | undefined> {
        return this.closed.asObservable();
    }
}
