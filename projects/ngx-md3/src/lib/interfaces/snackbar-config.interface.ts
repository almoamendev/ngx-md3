import { Injector, ViewContainerRef } from '@angular/core';

export type SnackbarPoliteness = 'polite' | 'assertive';

export interface SnackbarConfig<D = unknown> {
    /**
     * Context object passed to the message when it is a TemplateRef (read via
     * NgTemplateOutlet's context). Ignored when the message is a plain string.
     */
    data?: D;

    /**
     * Shows a close (dismiss) icon instead of a text action. Material Design 3
     * snackbars support only one or the other, never both — passing an
     * actionLabel to SnackbarService.open() together with showCloseIcon: true
     * throws, since that combination isn't a valid MD3 snackbar.
     */
    showCloseIcon?: boolean;

    /**
     * Auto-dismiss delay in milliseconds. Defaults to 4000. Pass 0 to disable
     * auto-dismiss entirely — the snackbar then stays open until the action,
     * the close icon, SnackbarRef.close(), or SnackbarService.dismiss() is
     * used. Useful for progress/status snackbars driven by a TemplateRef.
     */
    duration?: number;

    /**
     * Controls aria-live politeness and the implicit role: 'polite' renders
     * role="status" (announced without interrupting), 'assertive' renders
     * role="alert" (announced immediately). Defaults to 'polite'.
     */
    politeness?: SnackbarPoliteness;

    /**
     * When true, immediately dismisses whatever snackbar is currently showing
     * and moves this one to the front of the queue instead of waiting its
     * turn behind already-queued snackbars.
     */
    replaceCurrent?: boolean;

    ariaLabel?: string;
    direction?: null | 'ltr' | 'rtl';
    position?: 'start' | 'center' | 'end';

    /**
     * Optional Angular context for the message TemplateRef.
     */
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}
