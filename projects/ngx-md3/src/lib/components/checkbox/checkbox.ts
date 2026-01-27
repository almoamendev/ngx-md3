import { AfterContentInit, Component, ContentChild, DestroyRef, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../common/state-component';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlName } from '@angular/forms';

@Component({
    selector: 'md3-checkbox',
    imports: [
        MaterialIcon
    ],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class Checkbox implements AfterContentInit {
    @Input() control?: AbstractControl;

    public checkboxIcon: 'check_small' | 'check_indeterminate_small' = 'check_small';
    public hasError: boolean = false;

    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;

    constructor(
        private el: ElementRef<HTMLElement>,
        private destroyRef: DestroyRef
    ) {
    }

    public get formControl(): AbstractControl | undefined {
        if (this.control) {
            return this.control;
        }

        return this.controlName?.control;
    }

    private get inputError(): boolean {
        if (this.formControl) {
            return this.formControl?.invalid && (this.formControl?.touched || this.formControl?.dirty);
        }

        return !(this.input?.nativeElement.validity.valid ?? true) || this.input?.nativeElement.ariaInvalid === 'true';
    }

    private updateInputValidity() {
        this.hasError = this.inputError;

        if (this.hasError) {
            this.input?.nativeElement.setAttribute('aria-invalid', 'true');
        } else {
            this.input?.nativeElement.setAttribute('aria-invalid', 'false');
        }
    }

    ngAfterContentInit(): void {
        if (this.input?.nativeElement) {
            fromEvent(this.input.nativeElement, 'focus').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.el.nativeElement.classList.add('md3-focused');
            });

            fromEvent(this.input.nativeElement, 'blur').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.el.nativeElement.classList.remove('md3-focused');
            });

            fromEvent(this.input.nativeElement, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                if (this.input?.nativeElement.indeterminate) {
                    this.checkboxIcon = 'check_indeterminate_small';
                } else {
                    this.checkboxIcon = 'check_small';
                }
            });
        }

        this.updateInputValidity();

        this.formControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.updateInputValidity();
        });
    }

    private setState(state: boolean | null = false) {
        if (this.input?.nativeElement) {
            this.input.nativeElement.indeterminate = state === null;
            this.input.nativeElement.checked = state === true;
            this.input.nativeElement.dispatchEvent(new Event('change'));
        }
    }
}
