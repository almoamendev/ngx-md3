import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectField } from './select-field';
import { SelectOption } from '../../types/select-option.type';

function people(): SelectOption[] {
    return [
        { value: 'ada', label: 'Ada' },
        { value: 'alan', label: 'Alan' },
        { value: 'grace', label: 'Grace' },
    ];
}

@Component({
    imports: [SelectField, ReactiveFormsModule],
    template: `<md3-select-field [options]="options" [formControl]="control"></md3-select-field>`,
})
class FormControlHost {
    options = people();
    control = new FormControl<string | null>('alan');
}

@Component({
    imports: [SelectField, ReactiveFormsModule],
    template: `
        <form [formGroup]="form">
            <md3-select-field [options]="options" formControlName="person"></md3-select-field>
        </form>
    `,
})
class FormControlNameHost {
    options = people();
    form = new FormGroup({
        person: new FormControl<string | null>('grace', Validators.required),
    });

    get control(): FormControl<string | null> {
        return this.form.controls.person;
    }
}

@Component({
    imports: [SelectField, ReactiveFormsModule],
    template: `<md3-select-field [options]="options" multiple [formControl]="control"></md3-select-field>`,
})
class MultipleHost {
    options = people();
    control = new FormControl<string[] | null>(['ada', 'grace']);
}

@Component({
    imports: [SelectField, ReactiveFormsModule],
    template: `
        <md3-select-field [options]="options" multiple [display-with]="format"
            [formControl]="control"></md3-select-field>
    `,
})
class DisplayWithHost {
    options = people();
    control = new FormControl<string[] | null>(['ada', 'grace']);

    format = (selected: SelectOption[]): string =>
        selected[0].label + (selected.length > 1 ? ` (+${selected.length - 1})` : '');
}

@Component({
    imports: [SelectField],
    template: `<md3-select-field [options]="options" [control]="control"></md3-select-field>`,
})
class ControlInputHost {
    options = people();
    control = new FormControl<string | null>('ada');
}

@Component({
    imports: [SelectField],
    template: `<md3-select-field searchable [options]="options"></md3-select-field>`,
})
class SearchableHost {
    options: SelectOption[] = [
        { value: 'ak', label: 'AK', supportingText: 'Alaska', selected: true },
        { value: 'ny', label: 'NY', supportingText: 'New York', trailingText: 'East coast' },
        { value: 12, label: 'Twelve' },
    ];
}

@Component({
    imports: [SelectField],
    template: `<md3-select-field [options]="options"></md3-select-field>`,
})
class StandaloneHost {
    options: SelectOption[] = [
        { value: 'ada', label: 'Ada' },
        { value: 'alan', label: 'Alan', selected: true },
    ];
}

describe('SelectField', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormControlHost,
                FormControlNameHost,
                MultipleHost,
                DisplayWithHost,
                ControlInputHost,
                SearchableHost,
                StandaloneHost,
            ],
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(StandaloneHost);
        fixture.detectChanges();

        expect(getSelectField(fixture)).toBeTruthy();
    });

    it('should seed the selection from SelectOption.selected without a control', () => {
        const fixture = TestBed.createComponent(StandaloneHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Alan');
    });

    it('should display the initial value of a [formControl]', () => {
        const fixture = TestBed.createComponent(FormControlHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Alan');
        expect(getSelectField(fixture).selectedOptions().map(o => o.value)).toEqual(['alan']);
    });

    it('should display the initial value of a formControlName', () => {
        const fixture = TestBed.createComponent(FormControlNameHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Grace');
    });

    it('should follow later control value changes', () => {
        const fixture = TestBed.createComponent(FormControlHost);
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('grace');
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Grace');

        fixture.componentInstance.control.setValue(null);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('');
    });

    it('should let the control override SelectOption.selected', () => {
        const fixture = TestBed.createComponent(FormControlHost);
        fixture.componentInstance.options = [
            { value: 'ada', label: 'Ada', selected: true },
            { value: 'alan', label: 'Alan' },
        ];
        fixture.componentInstance.control.setValue('alan');
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Alan');
        expect(fixture.componentInstance.options[0].selected).toBeFalse();
    });

    it('should join the labels of a multiple selection', () => {
        const fixture = TestBed.createComponent(MultipleHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Ada, Grace');
        expect(getSelectField(fixture).selectedOptions().map(o => o.value)).toEqual(['ada', 'grace']);
    });

    it('should format the displayed text with display-with', () => {
        const fixture = TestBed.createComponent(DisplayWithHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Ada (+1)');
    });

    it('should not call display-with for an empty selection', () => {
        const fixture = TestBed.createComponent(DisplayWithHost);
        let calls = 0;
        const format = fixture.componentInstance.format;
        fixture.componentInstance.format = (selected) => {
            calls++;
            return format(selected);
        };
        fixture.componentInstance.control.setValue([]);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('');
        expect(calls).toBe(0);
    });

    it('should keep a single selection when the control holds an array', () => {
        const fixture = TestBed.createComponent(FormControlHost);
        fixture.detectChanges();

        fixture.componentInstance.control.setValue(['alan', 'grace'] as unknown as string);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Alan');
    });

    it('should disable the field when the control is disabled', () => {
        const fixture = TestBed.createComponent(FormControlHost);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        fixture.detectChanges();

        expect(getSelectField(fixture).isDisabled()).toBeTrue();
        expect(getInput(fixture).disabled).toBeTrue();

        fixture.componentInstance.control.enable();
        fixture.detectChanges();

        expect(getSelectField(fixture).isDisabled()).toBeFalse();
        expect(getInput(fixture).disabled).toBeFalse();
    });

    it('should not open the menu while disabled', () => {
        const fixture = TestBed.createComponent(FormControlHost);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        fixture.detectChanges();

        getSelectField(fixture).openMenu();
        fixture.detectChanges();

        expect(document.querySelector('md3-select-options')).toBeNull();
    });

    it('should forward the control error state to the field', () => {
        const fixture = TestBed.createComponent(FormControlNameHost);
        fixture.componentInstance.control.setValue(null);
        fixture.detectChanges();

        expect(getSupportingText(fixture).classList).not.toContain('md3-has-error');

        fixture.componentInstance.control.markAsTouched();
        fixture.detectChanges();

        expect(getSupportingText(fixture).classList).toContain('md3-has-error');
    });

    it('should keep the input read-only unless the field is searchable', () => {
        const plain = TestBed.createComponent(StandaloneHost);
        plain.detectChanges();
        expect(getInput(plain).readOnly).toBeTrue();

        const searchable = TestBed.createComponent(SearchableHost);
        searchable.detectChanges();
        expect(getInput(searchable).readOnly).toBeFalse();
    });

    it('should show the query while focused and the selection after', () => {
        const fixture = TestBed.createComponent(SearchableHost);
        fixture.detectChanges();
        const input = getInput(fixture);

        expect(input.value).toBe('AK');

        search(fixture, 'new');
        expect(input.value).toBe('new');

        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(input.value).toBe('AK');
        expect(getSelectField(fixture).filteredOptions().length).toBe(3);
    });

    it('should match the label, the value, the supporting text and the trailing text', () => {
        const fixture = TestBed.createComponent(SearchableHost);
        fixture.detectChanges();

        search(fixture, 'twe');
        expect(matched(fixture)).toEqual(['Twelve']);

        search(fixture, '12');
        expect(matched(fixture)).toEqual(['Twelve']);

        search(fixture, 'alaska');
        expect(matched(fixture)).toEqual(['AK']);

        search(fixture, 'coast');
        expect(matched(fixture)).toEqual(['NY']);
    });

    it('should ignore case, spaces and punctuation', () => {
        const fixture = TestBed.createComponent(SearchableHost);
        fixture.detectChanges();

        search(fixture, 'NEWYORK');
        expect(matched(fixture)).toEqual(['NY']);

        search(fixture, '  new   york ');
        expect(matched(fixture)).toEqual(['NY']);

        search(fixture, 'east-coast!');
        expect(matched(fixture)).toEqual(['NY']);
    });

    it('should not match across two fields of the same option', () => {
        const fixture = TestBed.createComponent(SearchableHost);
        fixture.detectChanges();

        // 'NY' + 'New York' must not read as one text
        search(fixture, 'nynew');
        expect(matched(fixture)).toEqual([]);
    });

    it('should show every option again once the query is empty', () => {
        const fixture = TestBed.createComponent(SearchableHost);
        fixture.detectChanges();

        search(fixture, 'zz');
        expect(matched(fixture)).toEqual([]);

        search(fixture, '');
        expect(matched(fixture)).toEqual(['AK', 'NY', 'Twelve']);
    });

    it('should support a control passed through [control]', () => {
        const fixture = TestBed.createComponent(ControlInputHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Ada');

        fixture.componentInstance.control.setValue('grace');
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Grace');
    });
});

function search<T>(fixture: ComponentFixture<T>, text: string): void {
    const input = getInput(fixture);

    input.dispatchEvent(new Event('focus'));
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
}

function matched<T>(fixture: ComponentFixture<T>): string[] {
    return getSelectField(fixture).filteredOptions().map((option) => option.label);
}

function getSelectField<T>(fixture: ComponentFixture<T>): SelectField {
    return fixture.debugElement.query(By.directive(SelectField)).componentInstance;
}

function getInput<T>(fixture: ComponentFixture<T>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
}

function getSupportingText<T>(fixture: ComponentFixture<T>): HTMLElement {
    return fixture.nativeElement.querySelector('.md3-supporting-text-container');
}
