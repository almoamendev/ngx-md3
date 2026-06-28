import { booleanAttribute, Component, computed, contentChild, effect, input, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { InputElement } from '../../common/input-element';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'md3-radio-button',
    imports: [
        StateComponent
    ],
    templateUrl: './radio-button.html',
    styleUrl: './radio-button.scss',
})
export class RadioButton {
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

    public state = signal<boolean>(false);

    public formControl = computed<AbstractControl | undefined>(() => this.control() ?? this.controlName()?.control);

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
                this.syncControlFromInput(input);
                this.syncNativeInputState(input);
            });

            const documentEvents = fromEvent(input.ownerDocument, 'change').subscribe((event) => {
                if (this.isSameRadioGroup(input, event.target)) {
                    this.syncStateFromInput(input);
                    this.syncNativeInputState(input);
                }
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
                attributeFilter: ['aria-invalid', 'checked', 'disabled', 'name', 'required', 'value'],
            });

            onCleanup(() => {
                inputEvents.unsubscribe();
                documentEvents.unsubscribe();
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

    private getInputValue(input: HTMLInputElement | undefined = this.input()?.nativeElement): unknown {
        return input?.value ?? true;
    }

    private updateState(state: boolean = false): void {
        this.state.set(state);
    }

    private syncStateFromInput(input: HTMLInputElement): void {
        this.updateState(input.checked);
    }

    private syncInputFromState(state: boolean = false): void {
        const input = this.input()?.nativeElement;
        if (input && input.checked !== state) {
            input.checked = state;
        }
    }

    private syncControlFromInput(input: HTMLInputElement): void {
        const control = this.formControl();
        if (!control || !input.checked) {
            return;
        }

        const inputValue = this.getInputValue(input);
        if (control.value !== inputValue) {
            control.setValue(inputValue);
        }
    }

    private syncStateFromControl(control: AbstractControl): void {
        const controlState = control.value === this.getInputValue();

        this.updateState(controlState);
        this.syncInputFromState(controlState);
    }

    private isSameRadioGroup(input: HTMLInputElement, target: EventTarget | null): boolean {
        return target instanceof HTMLInputElement
            && target.type === 'radio'
            && target.name === input.name
            && target.form === input.form;
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
