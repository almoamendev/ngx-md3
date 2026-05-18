import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DialogConfig } from '../../interfaces/dialog-config.interface';

export const DIALOG_DATA = new InjectionToken<unknown>('MD3_DIALOG_DATA');
export const DIALOG_CONFIG = new InjectionToken<DialogConfig>('MD3_DIALOG_CONFIG');
export const DIALOG_COMPONENT = new InjectionToken<Type<unknown>>('MD3_DIALOG_COMPONENT');

export class DialogRef<T = unknown, R = unknown> {
    private readonly closed = new Subject<R | undefined>();
    private isClosed = false;

    /**
     * Filled by DialogService after the user component is attached. Keeping the
     * instance here lets callers imperatively update inputs when that is useful.
     */
    public componentInstance?: T;

    constructor(
        private readonly overlayRef: OverlayRef,
        private readonly previouslyFocusedElement: HTMLElement | null,
        private readonly shouldRestoreFocus: boolean,
    ) {
    }

    public close(result?: R): void {
        if (this.isClosed) {
            return;
        }

        this.isClosed = true;

        // Disposing the overlay removes the wrapper, the backdrop, and the
        // dynamically attached content component in one operation.
        this.overlayRef.dispose();

        if (this.shouldRestoreFocus) {
            this.previouslyFocusedElement?.focus();
        }

        this.closed.next(result);
        this.closed.complete();
    }

    public afterClosed(): Observable<R | undefined> {
        return this.closed.asObservable();
    }
}
