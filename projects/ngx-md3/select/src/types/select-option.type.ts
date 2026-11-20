export type SelectOptionValue = string | number;

/**
 * Value shape exposed to Angular forms by md3-select-field.
 * Single selection emits a single value (or null), multiple selection emits an array.
 */
export type SelectFieldValue = SelectOptionValue | SelectOptionValue[] | null;

export type SelectOption = {
    value: SelectOptionValue;
    label: string;
    supportingText?: string;
    trailingText?: string;
    selected?: boolean;
}
