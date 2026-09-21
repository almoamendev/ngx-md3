import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptions } from './select-options';
import { SelectOption, SelectOptionValue } from '../../../types/select-option.type';

function people(): SelectOption[] {
    return [
        { value: 'ada', label: 'Ada' },
        { value: 'alan', label: 'Alan' },
        { value: 'grace', label: 'Grace' },
    ];
}

describe('SelectOptions', () => {
    let fixture: ComponentFixture<SelectOptions>;
    let component: SelectOptions;
    let options: SelectOption[];
    let emitted: SelectOptionValue[][];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectOptions],
        }).compileComponents();

        options = people();
        emitted = [];

        fixture = TestBed.createComponent(SelectOptions);
        component = fixture.componentInstance;
        // `options` is a required input. Set it before the first change detection
        // run, or the component throws NG0950.
        fixture.componentRef.setInput('options', options);
        component.selectionChange.subscribe((values) => emitted.push(values));

        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render one menu item per option', () => {
        expect(labels(fixture)).toEqual(['Ada', 'Alan', 'Grace']);
    });

    it('should render the supporting text and the trailing text of an option', async () => {
        fixture.componentRef.setInput('options', [
            { value: 'ada', label: 'Ada', supportingText: 'Analyst', trailingText: '1815' },
        ]);
        await fixture.whenStable();

        const item = items(fixture)[0];

        expect(item.querySelector('md3-type-body')?.textContent?.trim()).toBe('Analyst');
        expect(item.querySelector('md3-type-title')?.textContent?.trim()).toBe('1815');
    });

    it('should mark the options that are already selected', async () => {
        fixture.componentRef.setInput('options', [
            { value: 'ada', label: 'Ada' },
            { value: 'alan', label: 'Alan', selected: true },
        ]);
        await fixture.whenStable();

        expect(checkedStates(fixture)).toEqual([false, true]);
    });

    it('should select an option on a click and emit its value', async () => {
        await click(fixture, 1);

        expect(options.map((option) => option.selected)).toEqual([false, true, false]);
        expect(emitted).toEqual([['alan']]);
    });

    it('should replace the previous selection in single selection mode', async () => {
        await click(fixture, 1);
        await click(fixture, 2);

        expect(options.map((option) => option.selected)).toEqual([false, false, true]);
        expect(emitted).toEqual([['alan'], ['grace']]);
    });

    it('should keep a single selection when the user clicks the same option twice', async () => {
        await click(fixture, 0);
        await click(fixture, 0);

        expect(options.map((option) => option.selected)).toEqual([true, false, false]);
        expect(emitted).toEqual([['ada'], ['ada']]);
    });

    it('should add to the selection in multiple selection mode', async () => {
        fixture.componentRef.setInput('multiple', true);
        await fixture.whenStable();

        await click(fixture, 0);
        await click(fixture, 2);

        expect(options.map((option) => option.selected)).toEqual([true, false, true]);
        expect(emitted).toEqual([['ada'], ['ada', 'grace']]);
    });

    it('should remove an option from the selection on a second click in multiple selection mode', async () => {
        fixture.componentRef.setInput('multiple', true);
        await fixture.whenStable();

        await click(fixture, 0);
        await click(fixture, 2);
        await click(fixture, 0);

        expect(options.map((option) => option.selected)).toEqual([false, false, true]);
        expect(emitted.at(-1)).toEqual(['grace']);
    });

    it('should emit the values in the order of the options', async () => {
        fixture.componentRef.setInput('multiple', true);
        await fixture.whenStable();

        await click(fixture, 2);
        await click(fixture, 0);

        expect(emitted.at(-1)).toEqual(['ada', 'grace']);
    });

    it('should show the selection in the rendered items', async () => {
        fixture.componentRef.setInput('multiple', true);
        await fixture.whenStable();

        await click(fixture, 1);

        expect(checkedStates(fixture)).toEqual([false, true, false]);
    });

    it('should do nothing for an index that has no option', () => {
        component.optionClick(9);

        expect(options.some((option) => option.selected)).toBeFalse();
        expect(emitted).toEqual([]);
    });
});

function items(fixture: ComponentFixture<SelectOptions>): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[md3-menu-item]'));
}

function labels(fixture: ComponentFixture<SelectOptions>): (string | undefined)[] {
    return items(fixture).map(
        (item) => item.querySelector('.md3-menu-item-content md3-type-label')?.textContent?.trim()
    );
}

function checkedStates(fixture: ComponentFixture<SelectOptions>): boolean[] {
    return items(fixture).map(
        (item) => (item.querySelector('input[type="checkbox"]') as HTMLInputElement).checked
    );
}

async function click(fixture: ComponentFixture<SelectOptions>, index: number): Promise<void> {
    items(fixture)[index].click();
    await fixture.whenStable();
}
