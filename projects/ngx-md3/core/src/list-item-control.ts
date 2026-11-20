import { InjectionToken, Signal } from '@angular/core';

/** A selection control a list item reads its selected and disabled state from. */
export interface ListItemControl {
    readonly listItemControlType: 'checkbox' | 'radio' | 'switch';
    readonly state: Signal<boolean | null>;
    readonly isDisabled: Signal<boolean>;
}

/**
 * Provided by the checkbox, the radio button and the switch, so a list item can find them in its
 * content without loading all three.
 */
export const LIST_ITEM_CONTROL = new InjectionToken<ListItemControl>('MD3_LIST_ITEM_CONTROL');
