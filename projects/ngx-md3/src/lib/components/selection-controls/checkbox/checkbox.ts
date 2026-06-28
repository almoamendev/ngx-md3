import { booleanAttribute, Component, computed, contentChild, effect, input, signal, Signal, viewChild } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { InputElement } from '../../common/input-element';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'md3-checkbox',
    imports: [
        MaterialIcon,
        StateComponent,
    ],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
})
export class Checkbox {
    public control = input<AbstractControl | undefined>(undefined, {
        alias: 'control',
    });

    private stateComponent = viewChild<StateComponent>(StateComponent);
    private input = contentChild(InputElement);
    private controlName = contentChild(FormControlName);
    private controlError = signal(false);
    private nativeInputError = signal(false);

    public disableStateLayer = input<boolean, unknown>(false, {
        alias: 'disable-state-layer',
        transform: booleanAttribute
    });

    protected checkboxIcon: 'check_small' | 'check_indeterminate_small' = 'check_small';
    public state = signal<boolean | null>(false);

    protected formControl = computed<AbstractControl | undefined>(() => this.control() ?? this.controlName()?.control);

    private inputError = computed<boolean>(() => {
        const control = this.formControl();
        if (control) {
            this.controlError();
            return this.hasControlError(control);
        }

        const input = this.input()?.nativeElement;
        if (!input) {
            return false;
        }

        this.nativeInputError();
        return this.hasNativeInputError(input);
    });

    constructor() {
        effect(() => {
            this.stateComponent()?.setStateLayer(!this.disableStateLayer());
        });

        effect((onCleanup) => {
            const input = this.input()?.nativeElement;
            if (!input) {
                return;
            }

            this.syncInitialState(input);
            this.syncNativeInputState(input);

            const inputEvents = fromEvent(input, 'change').subscribe(() => {
                this.syncStateFromInput(input);
                this.syncControlFromState(this.state());
                this.syncNativeInputState(input);
            });

            const observer = typeof MutationObserver === 'undefined'
                ? undefined
                : new MutationObserver(() => {
                    if (!this.formControl()) {
                        this.syncStateFromInput(input);
                    }

                    this.syncNativeInputState(input);
                });
            observer?.observe(input, {
                attributes: true,
                attributeFilter: ['aria-invalid', 'checked', 'disabled', 'required'],
            });

            onCleanup(() => {
                inputEvents.unsubscribe();
                observer?.disconnect();
            });
        });

        effect((onCleanup) => {
            const control = this.formControl();
            if (!control) {
                this.controlError.set(false);
                return;
            }

            this.syncStateFromControl(control);
            this.syncControlError(control);
            this.syncInputDisabledState(control);

            const controlEvents = control.events.subscribe(() => {
                this.syncStateFromControl(control);
                this.syncControlError(control);
                this.syncInputDisabledState(control);
            });

            onCleanup(() => controlEvents.unsubscribe());
        });

        effect(() => {
            this.syncAriaInvalidAttribute(this.input()?.nativeElement);
        });
    }

    private syncInitialState(input: HTMLInputElement): void {
        const control = this.formControl();
        if (control) {
            this.syncStateFromControl(control);
            return;
        }

        this.syncStateFromInput(input);
    }

    private updateState(state: boolean | null = false): void {
        this.checkboxIcon = state === null
            ? 'check_indeterminate_small'
            : 'check_small';

        this.state.set(state);
    }

    private syncStateFromInput(input: HTMLInputElement): void {
        this.updateState(input.indeterminate ? null : input.checked);
    }

    private syncInputFromState(state: boolean | null = false): void {
        const input = this.input()?.nativeElement;
        if (!input) {
            return;
        }

        const indeterminate = state === null;
        const checked = state === true;

        if (input.indeterminate !== indeterminate) {
            input.indeterminate = indeterminate;
        }

        if (input.checked !== checked) {
            input.checked = checked;
        }
    }

    private syncControlFromState(state: boolean | null = false): void {
        const control = this.formControl();
        if (!control || control.value === state) {
            return;
        }

        control.setValue(state);
    }

    private syncStateFromControl(control: AbstractControl): void {
        const controlState = control.value === null
            ? null
            : control.value === true;

        this.updateState(controlState);
        this.syncInputFromState(controlState);
    }

    private syncNativeInputState(input: HTMLInputElement): void {
        this.nativeInputError.set(this.hasNativeInputError(input));
    }

    private syncControlError(control: AbstractControl): void {
        this.controlError.set(this.hasControlError(control));
    }

    private syncInputDisabledState(control: AbstractControl): void {
        const input = this.input()?.nativeElement;
        if (input && input.disabled !== control.disabled) {
            input.disabled = control.disabled;
        }
    }

    private hasNativeInputError(input: HTMLInputElement): boolean {
        return !input.validity.valid || input.ariaInvalid === 'true';
    }

    private hasControlError(control: AbstractControl): boolean {
        return control.invalid && (control.touched || control.dirty);
    }

    private syncAriaInvalidAttribute(input: HTMLInputElement | undefined): void {
        const value = this.inputError() ? 'true' : 'false';
        if (input && input.getAttribute('aria-invalid') !== value) {
            input.setAttribute('aria-invalid', value);
        }
    }

}
