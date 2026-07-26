import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SnackbarConfig } from '../../interfaces/snackbar-config.interface';
import { Snackbar } from './snackbar';

export const SNACKBAR_MESSAGE = new InjectionToken<string | TemplateRef<unknown>>('MD3_SNACKBAR_MESSAGE');
export const SNACKBAR_ACTION_LABEL = new InjectionToken<string | undefined>('MD3_SNACKBAR_ACTION_LABEL');
export const SNACKBAR_CONFIG = new InjectionToken<SnackbarConfig>('MD3_SNACKBAR_CONFIG');

const SNACKBAR_EXIT_ANIMATION_FALLBACK_MS = 300;

export type SnackbarDismissReason = 'timeout' | 'action' | 'manual';

export interface SnackbarDismiss<R = unknown> {
    reason: SnackbarDismissReason;
    result?: R;
}

export class SnackbarRef<R = unknown> {
    private readonly closed = new Subject<SnackbarDismiss<R>>();
    private readonly actionTriggered = new Subject<void>();
    private isClosed = false;
    private overlayRef?: OverlayRef;
    private timeoutId?: ReturnType<typeof setTimeout>;
    private timerStartedAt = 0;
    private remainingMs: number;

    public snackbarInstance?: Snackbar;

    constructor(private readonly duration: number) {
        this.remainingMs = duration;
    }

    /**
     * Called by SnackbarService once this snackbar is dequeued and actually
     * attached to the overlay. Queued-but-never-shown refs never get one, and
     * close() below handles that case without trying to animate or dispose.
     */
    public attachOverlay(overlayRef: OverlayRef): void {
        this.overlayRef = overlayRef;
    }

    public startTimer(): void {
        if (this.isClosed || this.duration <= 0 || this.timeoutId) {
            return;
        }

        this.timerStartedAt = Date.now();
        this.timeoutId = setTimeout(() => this.close('timeout'), this.remainingMs);
    }

    public pauseTimer(): void {
        if (!this.timeoutId) {
            return;
        }

        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        this.remainingMs = Math.max(0, this.remainingMs - (Date.now() - this.timerStartedAt));
    }

    public resumeTimer(): void {
        if (this.timeoutId || this.isClosed || this.duration <= 0 || this.remainingMs <= 0) {
            return;
        }

        this.startTimer();
    }

    public triggerAction(result?: R): void {
        if (this.isClosed) {
            return;
        }

        this.actionTriggered.next();
        this.close('action', result);
    }

    public close(reason: SnackbarDismissReason = 'manual', result?: R): void {
        if (this.isClosed) {
            return;
        }

        this.isClosed = true;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }

        if (!this.overlayRef) {
            // Still sitting in the queue — nothing was ever attached, so
            // there's nothing to animate or dispose.
            this.closed.next({ reason, result });
            this.closed.complete();
            this.actionTriggered.complete();
            return;
        }

        this.startCloseAnimation().then(() => {
            this.overlayRef!.dispose();
            this.closed.next({ reason, result });
            this.closed.complete();
            this.actionTriggered.complete();
        });
    }

    public onAction(): Observable<void> {
        return this.actionTriggered.asObservable();
    }

    public afterDismissed(): Observable<SnackbarDismiss<R>> {
        return this.closed.asObservable();
    }

    private startCloseAnimation(): Promise<void> {
        const panel = this.overlayRef!.overlayElement;
        const animatedElement = panel.querySelector<HTMLElement>('.md3-snackbar-container') ?? panel;

        panel.classList.add('md3-snackbar-closing');
        this.snackbarInstance?.isActive.set(false);

        return new Promise((resolve) => {
            let isResolved = false;
            const timeoutId = setTimeout(done, SNACKBAR_EXIT_ANIMATION_FALLBACK_MS);

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
}
