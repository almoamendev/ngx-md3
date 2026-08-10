import { Injector, Signal, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";

/**
 * How the sheet sits in the layout. A modal sheet floats above the page in an overlay with a
 * scrim; a standard sheet docks into the scaffold, reserves its collapsed height and leaves the
 * rest of the page usable.
 */
export type BottomSheetType = 'standard' | 'modal';

/** Which of a standard sheet's two heights it is resting at. */
export type BottomSheetState = 'collapsed' | 'expanded';

export interface BottomSheetConfig<D = unknown> {
    data?: D;
    bindDataToInputs?: boolean;

    /** @default 'modal' */
    type?: BottomSheetType;

    /** Shows the MD3 drag handle centered above the sheet's content. */
    handle?: boolean;

    /**
     * Lets the sheet be dragged, and flung. A modal sheet is dragged down to dismiss it; a
     * standard sheet is dragged between its collapsed and expanded heights.
     */
    gestures?: boolean;

    /** Standard only. How much of the sheet shows when it is collapsed. */
    collapsedHeight?: number | string;

    /** Standard only. Height the sheet grows to when it is expanded. */
    expandedHeight?: number | string;

    /** Standard only. Which height the sheet opens at. */
    initialState?: BottomSheetState;

    /** Standard only. Whether dragging below the collapsed height closes the sheet. */
    dismissible?: boolean;

    /** Standard only. Accessible name for the region the sheet occupies. */
    label?: string;

    /** Standard only. Id of the element naming the sheet, when it already has a visible title. */
    labelledBy?: string;

    scheme?: 'inherit' | 'dark' | 'light';
    direction?: null | 'ltr' | 'rtl';
    viewContainerRef?: ViewContainerRef;
    injector?: Injector;
}

/**
 * What BottomSheetRef needs from the surface hosting a sheet, whichever shell it was created
 * in. The surface reports gestures rather than acting on them, because it is created before
 * the reference exists and cannot reach it through DI.
 */
export interface BottomSheetSurfaceHost {
    readonly surfaceElement: HTMLElement | null;

    /** Emits when a drag gesture asks for the sheet to be dismissed. */
    readonly dismissed: Observable<void>;

    /** Emits how far a drag has taken the sheet towards being dismissed, from 0 to 1. */
    readonly dragProgress: Observable<number>;

    /** Emits the height a drag settled the sheet at. Standard sheets only. */
    readonly stateChanges: Observable<BottomSheetState>;

    startEnterAnimation(): void;
    setActive(value: boolean): void;
}

/**
 * The modal shell, which is a CDK dialog container underneath and so has focus handling the
 * standard shell deliberately does without.
 */
export interface BottomSheetContainer extends BottomSheetSurfaceHost {
    recaptureFocus(): void;
}

/**
 * The docked shell, which owns the two heights a standard sheet moves between. Typed as an
 * interface so BottomSheetRef can drive the shell without importing the component it lives in.
 */
export interface StandardBottomSheetHost extends BottomSheetSurfaceHost {
    readonly state: Signal<BottomSheetState>;
    expand(): void;
    collapse(): void;
    toggle(): void;
    setCollapsedHeight(value: number | string): void;
    setExpandedHeight(value: number | string): void;
    setDismissible(value: boolean): void;
}
