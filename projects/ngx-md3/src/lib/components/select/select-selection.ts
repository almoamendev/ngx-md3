export type SelectComparator<T> = (a: T, b: T) => boolean;

/**
 * Selection is held as an array whatever the select's mode is, and converted back at the public
 * boundary. Keeping one shape on the inside is what stops every method having to branch on
 * single vs multiple.
 */

/** Reads an incoming value, from a form or a binding, as the internal array. */
export function normalizeValue<T>(
    value: T | readonly T[] | null | undefined,
    multiple: boolean,
): T[] {
    if (value === null || value === undefined) {
        return [];
    }

    if (multiple) {
        return Array.isArray(value) ? [...value] : [value as T];
    }

    // A single select given an array takes the first entry rather than throwing, so a control
    // switched from multiple to single degrades instead of breaking.
    if (Array.isArray(value)) {
        return value.length > 0 ? [value[0]] : [];
    }

    return [value as T];
}

/** Turns the internal array back into what the consumer and the form see. */
export function externalValue<T>(selection: readonly T[], multiple: boolean): T | T[] | null {
    if (multiple) {
        return [...selection];
    }

    return selection.length > 0 ? selection[0] : null;
}

export function findValueIndex<T>(
    selection: readonly T[],
    value: T,
    compare: SelectComparator<T>,
): number {
    return selection.findIndex((selected) => compare(selected, value));
}

export function isValueSelected<T>(
    selection: readonly T[],
    value: T,
    compare: SelectComparator<T>,
): boolean {
    return findValueIndex(selection, value, compare) !== -1;
}

/**
 * Picks a value. A single select replaces what it had, so choosing the option that is already
 * selected keeps it selected rather than clearing the field; only a multiple select unpicks.
 */
export function toggleValue<T>(
    selection: readonly T[],
    value: T,
    multiple: boolean,
    compare: SelectComparator<T>,
): T[] {
    if (!multiple) {
        return [value];
    }

    const index = findValueIndex(selection, value, compare);

    if (index === -1) {
        return [...selection, value];
    }

    return selection.filter((_, position) => position !== index);
}

/** Whether two selections hold the same values in the same order. */
export function valuesEqual<T>(
    a: readonly T[],
    b: readonly T[],
    compare: SelectComparator<T>,
): boolean {
    return a.length === b.length && a.every((value, index) => compare(value, b[index]));
}
