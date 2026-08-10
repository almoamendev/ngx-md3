import { Injector, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";

export interface BottomSheetConfig<D = unknown> {
    data?: D;
    bindDataToInputs?: boolean;

    /** Shows the MD3 drag handle centered above the sheet's content. */
    handle?: boolean;

    /** Lets the sheet be dragged down, and flung, to dismiss it. */
    gestures?: boolean;

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

    /** Emits when a drag gesture asks for the sheet to be dismissed. */
    readonly dismissed: Observable<void>;

    /** Emits how far a drag has taken the sheet towards being dismissed, from 0 to 1. */
    readonly dragProgress: Observable<number>;

    startEnterAnimation(): void;
    setActive(value: boolean): void;
    recaptureFocus(): void;
}
