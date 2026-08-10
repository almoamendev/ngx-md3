import { Injector, ViewContainerRef } from "@angular/core";

export interface BottomSheetConfig<D = unknown> {
    data?: D;
    bindDataToInputs?: boolean;

    /** Insets the sheet from the viewport edges and rounds every corner. */
    inset?: boolean;

    /** Shows the MD3 drag handle centered above the sheet's content. */
    handle?: boolean;

    scheme?: 'inherit' | 'dark' | 'light';
    direction?: null | 'ltr' | 'rtl';
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

/**
 * What BottomSheetRef needs from the shell hosting a bottom sheet, mirroring
 * DialogContainer: a bottom sheet is a CDK dialog container underneath, not a
 * side-sheet-style outlet.
 */
export interface BottomSheetContainer {
    readonly surfaceElement: HTMLElement | null;
    startEnterAnimation(): void;
    setActive(value: boolean): void;
    recaptureFocus(): void;
}
