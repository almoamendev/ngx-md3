import { InjectionToken, Signal } from "@angular/core";
import { SelectComparator } from "../components/select/select-selection";
import { SelectFilterMode } from "../types/select-filter-mode.type";

/**
 * What an option needs from the select holding it. Options reach the select through this token
 * rather than by importing it, which is what keeps the dependency one-way: the select imports
 * the option class for its content query, the option imports nothing.
 */
export interface SelectContext<T = any> {
    readonly multiple: Signal<boolean>;
    readonly compareWith: Signal<SelectComparator<T>>;
    readonly selection: Signal<readonly T[]>;
    readonly searchQuery: Signal<string>;
    readonly filterMode: Signal<SelectFilterMode>;

    /** Picks an option's value, toggling it when the select takes more than one. */
    selectValue(value: T): void;

    /**
     * Remembers what a value reads as, so the closed field can still name a selection whose
     * option has been filtered out or replaced by a server response.
     */
    registerLabel(value: T, label: string): void;
}

export const MD3_SELECT_CONTEXT = new InjectionToken<SelectContext>('MD3_SELECT_CONTEXT');
