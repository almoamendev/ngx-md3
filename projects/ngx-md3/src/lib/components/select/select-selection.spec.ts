import {
    externalValue,
    isValueSelected,
    normalizeValue,
    SelectComparator,
    toggleValue,
    valuesEqual,
} from './select-selection';

interface City {
    id: number;
    name: string;
}

const byId: SelectComparator<City> = (a, b) => a.id === b.id;
const identity: SelectComparator<string> = (a, b) => a === b;

describe('normalizeValue', () => {
    it('reads nothing as an empty selection', () => {
        expect(normalizeValue(null, false)).toEqual([]);
        expect(normalizeValue(undefined, true)).toEqual([]);
    });

    it('wraps a single value', () => {
        expect(normalizeValue('ny', false)).toEqual(['ny']);
        expect(normalizeValue('ny', true)).toEqual(['ny']);
    });

    it('keeps every value for a multiple select', () => {
        expect(normalizeValue(['ny', 'sf'], true)).toEqual(['ny', 'sf']);
    });

    it('takes the first entry when a single select is handed an array', () => {
        expect(normalizeValue(['ny', 'sf'], false)).toEqual(['ny']);
        expect(normalizeValue([], false)).toEqual([]);
    });

    it('copies rather than aliasing the incoming array', () => {
        const source = ['ny'];
        const normalized = normalizeValue(source, true);

        normalized.push('sf');

        expect(source).toEqual(['ny']);
    });
});

describe('externalValue', () => {
    it('gives a single select its value or null', () => {
        expect(externalValue(['ny'], false)).toBe('ny');
        expect(externalValue([], false)).toBeNull();
    });

    it('always gives a multiple select an array', () => {
        expect(externalValue(['ny', 'sf'], true)).toEqual(['ny', 'sf']);
        expect(externalValue([], true)).toEqual([]);
    });
});

describe('toggleValue', () => {
    it('replaces the selection of a single select', () => {
        expect(toggleValue(['ny'], 'sf', false, identity)).toEqual(['sf']);
    });

    it('keeps a single selection when the same option is picked again', () => {
        expect(toggleValue(['ny'], 'ny', false, identity)).toEqual(['ny']);
    });

    it('adds and removes for a multiple select', () => {
        expect(toggleValue(['ny'], 'sf', true, identity)).toEqual(['ny', 'sf']);
        expect(toggleValue(['ny', 'sf'], 'ny', true, identity)).toEqual(['sf']);
    });

    it('matches object values through the comparator', () => {
        const selection: City[] = [{ id: 1, name: 'New York' }];

        expect(toggleValue(selection, { id: 1, name: 'New York' }, true, byId)).toEqual([]);
        expect(toggleValue(selection, { id: 2, name: 'Boston' }, true, byId).length).toBe(2);
    });

    it('leaves the selection it was given untouched', () => {
        const selection = ['ny'];

        toggleValue(selection, 'sf', true, identity);

        expect(selection).toEqual(['ny']);
    });
});

describe('isValueSelected', () => {
    it('finds a value through the comparator', () => {
        const selection: City[] = [{ id: 1, name: 'New York' }];

        expect(isValueSelected(selection, { id: 1, name: 'renamed' }, byId)).toBe(true);
        expect(isValueSelected(selection, { id: 2, name: 'Boston' }, byId)).toBe(false);
    });
});

describe('valuesEqual', () => {
    it('compares length, order and contents', () => {
        expect(valuesEqual(['ny', 'sf'], ['ny', 'sf'], identity)).toBe(true);
        expect(valuesEqual(['ny', 'sf'], ['sf', 'ny'], identity)).toBe(false);
        expect(valuesEqual(['ny'], ['ny', 'sf'], identity)).toBe(false);
        expect(valuesEqual([], [], identity)).toBe(true);
    });

    it('treats distinct objects with the same identity as equal', () => {
        expect(valuesEqual(
            [{ id: 1, name: 'New York' }],
            [{ id: 1, name: 'New York' }],
            byId,
        )).toBe(true);
    });
});
