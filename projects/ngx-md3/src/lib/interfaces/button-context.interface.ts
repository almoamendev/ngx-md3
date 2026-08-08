import { InjectionToken, Signal } from "@angular/core";
import { IconButtonWidth } from "../types/icon-button-width.type";
import { ButtonSize } from "../types/button-size.type";
import { SplitButtonType } from "../types/split-button-type.type";
import { ButtonGroupSelection } from "../types/button-group-selection.type";

export interface ButtonContext {
    buttonContextSize?: Signal<ButtonSize>;
    buttonContextType?: Signal<SplitButtonType>;
    buttonContextWidth?: Signal<IconButtonWidth>;
    buttonContextSquared?: Signal<boolean>;
    buttonContextExtended?: Signal<boolean>;
    buttonContextSelection?: Signal<ButtonGroupSelection>;
}

export const MD3_BUTTON_CONTEXT = new InjectionToken<ButtonContext>('MD3_BUTTON_CONTEXT');