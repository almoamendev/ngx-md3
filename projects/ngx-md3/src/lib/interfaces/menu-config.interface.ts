import { Injector, ViewContainerRef } from "@angular/core";

export interface MenuConfig<D = unknown> {
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
    menuColors?: 'standard' | 'vibrant';

    /**
     * Optional Angular context for the dynamic component. Passing a
     * ViewContainerRef keeps dependency lookup close to the caller.
     */
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}