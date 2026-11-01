import { Injector, ViewContainerRef } from "@angular/core";

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