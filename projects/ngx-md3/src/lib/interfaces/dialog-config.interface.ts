import { Injector, ViewContainerRef } from "@angular/core";
import { DialogRole } from "../types/dialog-role.type";
import { PreviousDialog } from "../types/previous-dialog.type";

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