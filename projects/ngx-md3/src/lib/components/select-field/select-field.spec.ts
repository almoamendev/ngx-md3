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
    imports: [SelectField],
    template: `<md3-select-field [options]="options" [control]="control"></md3-select-field>`,
})
class ControlInputHost {
    options = people();
    control = new FormControl<string | null>('ada');
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
                ControlInputHost,
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

    it('should summarise a multiple selection', () => {
        const fixture = TestBed.createComponent(MultipleHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Ada +1');
        expect(getSelectField(fixture).selectedOptions().map(o => o.value)).toEqual(['ada', 'grace']);
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

    it('should support a control passed through [control]', () => {
        const fixture = TestBed.createComponent(ControlInputHost);
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Ada');

        fixture.componentInstance.control.setValue('grace');
        fixture.detectChanges();

        expect(getInput(fixture).value).toBe('Grace');
    });
});

function getSelectField<T>(fixture: ComponentFixture<T>): SelectField {
    return fixture.debugElement.query(By.directive(SelectField)).componentInstance;
}

function getInput<T>(fixture: ComponentFixture<T>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
}

function getSupportingText<T>(fixture: ComponentFixture<T>): HTMLElement {
    return fixture.nativeElement.querySelector('.md3-supporting-text-container');
}
