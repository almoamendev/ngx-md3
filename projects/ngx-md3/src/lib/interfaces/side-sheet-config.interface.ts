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
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

export interface SideSheetContainer {
    element: HTMLElement;
    showSheet(value: boolean): void;
    setHidden(value: boolean): void;
}