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
     * Stacks the action below the message on its own line, aligned to the
     * inline-end, instead of placing it beside the message on one row. Use
     * this when the action label is too long to comfortably share a line
     * with the message — Material Design 3's "long action" snackbar layout.
     * Has no effect when there's no actionLabel.
     */
    stackedAction?: boolean;

    /**
     * Called when the action button is clicked, right before the snackbar
     * closes with reason 'action'. Only fires for the action button — never
     * for the close icon, which always just dismisses. Equivalent to
     * subscribing to SnackbarRef.onAction(), but handy when you don't want
     * to hold onto the ref just to react to the click.
     */
    onAction?: () => void;

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
    scheme?: 'inherit' | 'dark' | 'light';
    direction?: null | 'ltr' | 'rtl';
    position?: 'start' | 'center' | 'end';

    /**
     * Optional Angular context for the message TemplateRef.
     */
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}
