import { buildTriggerLabel } from './select-trigger-label';

describe('buildTriggerLabel', () => {
    const cities = ['New York', 'Boston', 'Austin', 'Reno'];

    it('is empty when nothing is selected', () => {
        expect(buildTriggerLabel([], 2)).toBe('');
    });

    it('joins the visible labels and counts the rest', () => {
        expect(buildTriggerLabel(cities, 2)).toBe('New York, Boston +2');
    });

    it('leaves out the count when everything fits', () => {
        expect(buildTriggerLabel(cities, 4)).toBe('New York, Boston, Austin, Reno');
        expect(buildTriggerLabel(['New York'], 1)).toBe('New York');
    });

    it('never drops below one label, however little room there is', () => {
        expect(buildTriggerLabel(cities, 0)).toBe('New York +3');
        expect(buildTriggerLabel(cities, -5)).toBe('New York +3');
    });

    it('clamps a count larger than the selection', () => {
        expect(buildTriggerLabel(['New York', 'Boston'], 99)).toBe('New York, Boston');
    });

    it('takes a custom separator', () => {
        expect(buildTriggerLabel(cities, 2, ' / ')).toBe('New York / Boston +2');
    });
});
