import { AfterContentInit, Component, ContentChild, DestroyRef, effect, ElementRef, input, Input, signal } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class Slider implements AfterContentInit {
    @Input() control?: AbstractControl;
    public sliderSize = input<SliderSize>('x-small', {
        alias: 'slider-size',
    });

    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;

    public showValueLabel = input<boolean>(false, {
        alias: 'show-value-label'
    });

    public hasError: boolean = false;
    public value = signal<number>(0);
    public min = signal<number>(0);
    public max = signal<number>(100);
    public progress = signal<number>(0);

    constructor(
        private el: ElementRef<HTMLElement>,
        private destroyRef: DestroyRef
    ) {
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
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public get formControl(): AbstractControl | undefined {
        if (this.control) {
            return this.control;
        }

        return this.controlName?.control;
    }

    private get inputError(): boolean {
        if (this.formControl) {
            return this.formControl.invalid && (this.formControl.touched || this.formControl.dirty);
        }

        return !(this.input?.nativeElement.validity.valid ?? true) || this.input?.nativeElement.ariaInvalid === 'true';
    }

    private updateInputValidity(): void {
        this.hasError = this.inputError;

        if (this.hasError) {
            this.input?.nativeElement.setAttribute('aria-invalid', 'true');
        } else {
            this.input?.nativeElement.setAttribute('aria-invalid', 'false');
        }
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

    private syncLimitsFromInput(): void {
        if (!this.input?.nativeElement) {
            return;
        }

        let min = this.input.nativeElement.min === ''
            ? 0
            : Number(this.input.nativeElement.min);
        let max = this.input.nativeElement.max === ''
            ? 100
            : Number(this.input.nativeElement.max);

        this.min.set(Number.isFinite(min) ? min : 0);
        this.max.set(Number.isFinite(max) ? max : 100);
    }

    private syncStateFromInput(): void {
        if (!this.input?.nativeElement) {
            return;
        }

        this.syncLimitsFromInput();
        this.updateState(this.input.nativeElement.valueAsNumber);
    }

    private syncInputFromState(value: number = 0): void {
        if (!this.input?.nativeElement) {
            return;
        }

        this.input.nativeElement.valueAsNumber = value;
    }

    private syncControlFromState(value: number = 0): void {
        if (!this.formControl || this.formControl.value === value) {
            return;
        }

        this.formControl.setValue(value);
    }

    private syncStateFromControl(): void {
        if (!this.formControl) {
            return;
        }

        let controlValue = Number(this.formControl.value ?? this.min());

        this.syncLimitsFromInput();
        this.updateState(controlValue);
        this.syncInputFromState(controlValue);
    }

    ngAfterContentInit(): void {
        if (this.input?.nativeElement) {
            fromEvent(this.input.nativeElement, 'input').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.syncStateFromInput();
                this.syncControlFromState(this.value());
                this.updateInputValidity();
            });

            fromEvent(this.input.nativeElement, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.syncStateFromInput();
                this.syncControlFromState(this.value());
                this.updateInputValidity();
            });
        }

        if (this.formControl) {
            this.syncStateFromControl();
        } else {
            this.syncStateFromInput();
        }

        this.updateInputValidity();

        this.formControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.syncStateFromControl();
            this.updateInputValidity();
        });

        this.formControl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.syncStateFromControl();
            this.updateInputValidity();
        });
    }
}
