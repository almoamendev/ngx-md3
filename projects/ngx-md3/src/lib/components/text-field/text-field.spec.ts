import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TextField } from './text-field';
import { InputElement } from '../common/input-element';
import { SupportingText } from './supporting-text';

@Component({
    imports: [TextField, InputElement, SupportingText, ReactiveFormsModule],
    template: `
        <md3-text-field label="Name" [control]="control">
            <input md3-input-element type="text">
            <span md3-supporting-text>Required</span>
        </md3-text-field>
    `,
})
class ControlHost {
    control = new FormControl('', Validators.required);
}

@Component({
    imports: [TextField, InputElement, SupportingText],
    template: `
        <md3-text-field label="Name">
            <input md3-input-element type="text">
            <span md3-supporting-text>Required</span>
        </md3-text-field>
    `,
})
class NativeInputHost { }

@Component({
    imports: [TextField, InputElement],
    template: `
        <md3-text-field label="Name" [input-counter]="10">
            <input md3-input-element type="text">
        </md3-text-field>
    `,
})
class CounterHost { }

describe('TextField', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ControlHost,
                NativeInputHost,
                CounterHost,
            ],
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(NativeInputHost);
        fixture.detectChanges();

        expect(getTextField(fixture)).toBeTruthy();
    });

    it('should not show an error for an invalid form control before it is touched or dirty', () => {
        const fixture = TestBed.createComponent(ControlHost);
        fixture.detectChanges();

        expect(getTextField(fixture).inputError()).toBeFalse();
        expect(getInput(fixture).getAttribute('aria-invalid')).toBe('false');
        expect(getSupportingText(fixture).classList).not.toContain('md3-has-error');
    });

    it('should show an error when an invalid form control is touched', () => {
        const fixture = TestBed.createComponent(ControlHost);
        fixture.detectChanges();

        fixture.componentInstance.control.markAsTouched();
        fixture.detectChanges();

        expect(getTextField(fixture).inputError()).toBeTrue();
        expect(getInput(fixture).getAttribute('aria-invalid')).toBe('true');
        expect(getSupportingText(fixture).classList).toContain('md3-has-error');
    });

    it('should clear the error when the form control becomes valid', () => {
        const fixture = TestBed.createComponent(ControlHost);
        fixture.detectChanges();

        fixture.componentInstance.control.markAsTouched();
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('Ada');
        fixture.detectChanges();

        expect(getTextField(fixture).inputError()).toBeFalse();
        expect(getInput(fixture).getAttribute('aria-invalid')).toBe('false');
        expect(getSupportingText(fixture).classList).not.toContain('md3-has-error');
    });

    it('should react to native input validity changes', () => {
        const fixture = TestBed.createComponent(NativeInputHost);
        fixture.detectChanges();
        const input = getInput(fixture);

        input.required = true;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(getTextField(fixture).inputError()).toBeTrue();
        expect(input.getAttribute('aria-invalid')).toBe('true');

        input.value = 'Ada';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(getTextField(fixture).inputError()).toBeFalse();
        expect(input.getAttribute('aria-invalid')).toBe('false');
    });

    it('should react to aria-invalid changes on native inputs', async () => {
        const fixture = TestBed.createComponent(NativeInputHost);
        fixture.detectChanges();
        const input = getInput(fixture);

        input.setAttribute('aria-invalid', 'true');
        await fixture.whenStable();
        fixture.detectChanges();

        expect(getTextField(fixture).inputError()).toBeTrue();
        expect(getSupportingText(fixture).classList).toContain('md3-has-error');
    });

    it('should update the input counter when the value changes', () => {
        const fixture = TestBed.createComponent(CounterHost);
        fixture.detectChanges();
        const input = getInput(fixture);

        input.value = 'Ada';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(getCounter(fixture).textContent?.trim()).toBe('3/10');
    });
});

function getTextField<T>(fixture: ComponentFixture<T>): TextField {
    return fixture.debugElement.query(By.directive(TextField)).componentInstance;
}

function getInput<T>(fixture: ComponentFixture<T>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
}

function getSupportingText<T>(fixture: ComponentFixture<T>): HTMLElement {
    return fixture.nativeElement.querySelector('.md3-supporting-text-container');
}

function getCounter<T>(fixture: ComponentFixture<T>): HTMLElement {
    return fixture.nativeElement.querySelector('.md3-text-input-counter');
}
