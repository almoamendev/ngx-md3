import { InjectionToken } from '@angular/core';

/** What content inside a dialog can learn about the dialog without depending on it. */
export interface DialogContext {
    /** True while the dialog is hidden under another one. */
    readonly isHidden: boolean;
}

/**
 * Provided inside every dialog, in the shell and the content. Components that only need to know
 * whether they are in a dialog (the scaffold, the app bar) inject this, so they do not load the
 * dialog code.
 */
export const DIALOG_CONTEXT = new InjectionToken<DialogContext>('MD3_DIALOG_CONTEXT');
