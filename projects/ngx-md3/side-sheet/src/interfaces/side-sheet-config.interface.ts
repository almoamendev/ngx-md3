import { Injector, ViewContainerRef } from "@angular/core";
import { SheetHost } from "@almoamendev/ngx-md3/core";

export type SideSheetSide = 'start' | 'end';
export type SideSheetType = 'default' | 'standard' | 'modal';

export interface SideSheetConfig<D = unknown> {
    data?: D;
    bindDataToInputs?: boolean;
    side?: SideSheetSide;
    type?: SideSheetType;
    inset?: boolean;
    divider?: boolean;
    closeExisting?: boolean;

    /**
     * Which scaffold the sheet opens in. `'page'` opens it in the app's page scaffold even
     * while a full screen dialog with its own scaffold is up. The sheet then waits under the
     * dialog until it is hidden or closed, and outlives it.
     *
     * A sheet that can outlive the dialog should not get an injector from inside the dialog,
     * or it keeps the dialog's providers after they are destroyed.
     *
     * @default 'current'
     */
    host?: SheetHost;

    /**
     * Size of the sheet and everything in it, as a factor of 1rem: sets `--md3-scale` on the
     * sheet. When omitted, the sheet follows the `--md3-scale` of the layout it opens in.
     */
    scale?: number;
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

export interface SideSheetContainer {
    element: HTMLElement;
    showSheet(value: boolean): void;
    setHidden(value: boolean): void;
}