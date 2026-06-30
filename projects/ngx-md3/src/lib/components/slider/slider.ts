import { Component, computed, contentChild, effect, ElementRef, input, signal } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { InputElement } from '../common/input-element';
import { TypeBody } from '../../styles/typography/type-body';
import { SliderSize } from '../../types/slider-size.type';

@Component({
    selector: 'md3-slider',
    imports: [
        TypeBody,
    ],
    templateUrl: './slider.html',
    styleUrl: './slider.scss',
})
export class Slider {
    public control = input<AbstractControl | undefined>(undefined, {
        alias: 'control',
    });
    public sliderSize = input<SliderSize>('x-small', {
        alias: 'slider-size',
    });
    public showValueLabel = input<boolean>(false, {
        alias: 'show-value-label'
    });

    private input = contentChild<InputElement>(InputElement);
    private controlName = contentChild<FormControlName>(FormControlName);

    public value = signal<number>(0);
    public min = signal<number>(0);
    public max = signal<number>(100);
    public progress = signal<number>(0);

    protected formControl = computed<AbstractControl | undefined>(() => this.control() ?? this.controlName()?.control);

    constructor(private el: ElementRef<HTMLElement>) {
        effect((onCleanup) => {
            const size = 'md3-' + this.sliderSize();
            this.element.classList.add(size);

            onCleanup(() => {
                this.element.classList.remove(size);
            });
        });

        effect(() => {
            this.element.style.setProperty('--slider-progress', `${this.progress()}%`);
        });

        effect((onCleanup) => {
            const input = this.input()?.nativeElement;
            if (!input) {
                return;
            }

            this.syncInitialState(input);

            const inputEvents = merge(
                fromEvent(input, 'input'),
                fromEvent(input, 'change'),
            ).subscribe(() => {
                this.syncStateFromInput(input);
                this.syncControlFromState(this.value());
            });

            onCleanup(() => inputEvents.unsubscribe());
        });

        effect((onCleanup) => {
            const control = this.formControl();
            if (!control) {
                return;
            }

            this.syncStateFromControl(control);
            this.syncInputDisabledState(control);

            const controlEvents = control.events.subscribe(() => {
                this.syncStateFromControl(control);
                this.syncInputDisabledState(control);
            });

            onCleanup(() => controlEvents.unsubscribe());
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    private syncInitialState(input: HTMLInputElement): void {
        const control = this.formControl();
        if (control) {
            this.syncStateFromControl(control);
            return;
        }

        this.syncStateFromInput(input);
    }

    private updateState(value: number = 0): void {
        let min = this.min();
        let max = this.max();
        let range = max - min;
        let nextValue = Number.isFinite(value) ? value : min;
        let progress = range === 0
            ? 0
            : ((nextValue - min) / range) * 100;

        this.value.set(nextValue);
        this.progress.set(Math.min(100, Math.max(0, progress)));
    }

    private syncLimitsFromInput(input: HTMLInputElement | undefined = this.input()?.nativeElement): void {
        if (!input) {
            return;
        }

        let min = input.min === ''
            ? 0
            : Number(input.min);
        let max = input.max === ''
            ? 100
            : Number(input.max);

        this.min.set(Number.isFinite(min) ? min : 0);
        this.max.set(Number.isFinite(max) ? max : 100);
    }

    private syncStateFromInput(input: HTMLInputElement | undefined = this.input()?.nativeElement): void {
        if (!input) {
            return;
        }

        this.syncLimitsFromInput(input);
        this.updateState(input.valueAsNumber);
    }

    private syncInputFromState(value: number = 0): void {
        const input = this.input()?.nativeElement;
        if (!input) {
            return;
        }

        input.valueAsNumber = value;
    }

    private syncControlFromState(value: number = 0): void {
        const control = this.formControl();
        if (!control || control.value === value) {
            return;
        }

        control.setValue(value);
    }

    private syncStateFromControl(control: AbstractControl): void {
        let controlValue = Number(control.value ?? this.min());

        this.syncLimitsFromInput();
        this.updateState(controlValue);
        this.syncInputFromState(controlValue);
    }

    private syncInputDisabledState(control: AbstractControl): void {
        const input = this.input()?.nativeElement;
        if (input && input.disabled !== control.disabled) {
            input.disabled = control.disabled;
        }
    }
}
