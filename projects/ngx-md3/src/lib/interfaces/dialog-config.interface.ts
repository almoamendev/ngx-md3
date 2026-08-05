import { Injector, ViewContainerRef } from "@angular/core";
import { DialogRole } from "../types/dialog-role.type";

/**
 * What happens to a dialog that is already open when a new dialog opens.
 * - close: the open dialogs are closed before the new one opens.
 * - hide: the dialog on top is hidden and shown again once the new one closes.
 */
export type PreviousDialog = 'close' | 'hide';

export interface DialogConfig<D = unknown> {
    /**
     * Optional data passed to the component opened inside the dialog.
     * The dynamic component can read it by injecting DIALOG_DATA.
     */
    data?: D;

    /**
     * When enabled, object keys from data are also assigned to matching inputs
     * on the dynamic component through Angular's setInput API.
     */
    bindDataToInputs?: boolean;

    disableCloseEvents?: boolean;

    /**
     * What happens to a dialog that is already open when this dialog opens.
     * A hidden dialog keeps its state and is shown again once this dialog closes.
     */
    previousDialog?: PreviousDialog;

    role?: DialogRole;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    scheme?: 'inherit' | 'dark' | 'light';
    direction?: null | 'ltr' | 'rtl';

    /**
     * Optional Angular context for the dynamic component. Passing a
     * ViewContainerRef keeps dependency lookup close to the caller.
     */
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

/**
 * What DialogRef needs from the shell hosting a dialog. Implemented by both the
 * regular dialog and the full screen dialog, so the reference can drive either.
 */
export interface DialogContainer {
    /** Element that plays the enter and exit transition. */
    readonly surfaceElement: HTMLElement | null;

    /** Starts the enter animation. Delayed when the dialog replaces another one. */
    startEnterAnimation(): void;

    /** Shows or hides the surface, which is what drives both transitions. */
    setActive(value: boolean): void;

    /** Moves focus back inside the dialog when it is not there already. */
    recaptureFocus(): void;
}