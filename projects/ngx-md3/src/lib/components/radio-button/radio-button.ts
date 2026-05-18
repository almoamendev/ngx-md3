import { AfterContentInit, Component, ContentChild, DestroyRef, effect, ElementRef, input, Input, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputElement } from '../common/input-element';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-radio-button',
    imports: [
        StateComponent
    ],
    templateUrl: './radio-button.html',
    styleUrl: './radio-button.scss',
})
export class RadioButton implements AfterContentInit {
    @Input() control?: AbstractControl;

    private stateComponent = viewChild<StateComponent>(StateComponent);
    
    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;

    public readonly disableStateLayer = input<boolean>(false, {
        alias: 'disable-state-layer'
    });

    public hasError: boolean = false;
    public state = signal<boolean>(false);

    constructor(
        private el: ElementRef<HTMLElement>,
        private destroyRef: DestroyRef
    ) {
        effect(() => {
            if (this.disableStateLayer()) {
                this.stateComponent()?.setStateLayer(false);
            } else {
                this.stateComponent()?.setStateLayer(true);
            }
        });
    }

    public get formControl(): AbstractControl | undefined {
        if (this.control) {
            return this.control;
        }

        return this.controlName?.control;
    }

    private get inputValue(): unknown {
        if (!this.input?.nativeElement) {
            return true;
        }

        return this.input.nativeElement.value;
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

    private updateState(state: boolean = false): void {
        this.state.set(state);
    }

    private syncStateFromInput(): void {
        if (!this.input?.nativeElement) {
            return;
        }

        this.updateState(this.input.nativeElement.checked);
    }

    private syncInputFromState(state: boolean = false): void {
        if (!this.input?.nativeElement) {
            return;
        }

        this.input.nativeElement.checked = state;
    }

    private syncControlFromInput(): void {
        if (!this.formControl || !this.input?.nativeElement || !this.input.nativeElement.checked) {
            return;
        }

        if (this.formControl.value !== this.inputValue) {
            this.formControl.setValue(this.inputValue);
        }
    }

    private syncStateFromControl(): void {
        if (!this.formControl) {
            return;
        }

        let controlState = this.formControl.value === this.inputValue;

        this.updateState(controlState);
        this.syncInputFromState(controlState);
    }

    private isSameRadioGroup(target: EventTarget | null): boolean {
        if (!this.input?.nativeElement || !(target instanceof HTMLInputElement)) {
            return false;
        }

        return target.type === 'radio'
            && target.name === this.input.nativeElement.name
            && target.form === this.input.nativeElement.form;
    }

    ngAfterContentInit(): void {
        if (this.input?.nativeElement) {
            fromEvent(this.input.nativeElement, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.syncStateFromInput();
                this.syncControlFromInput();
                this.updateInputValidity();
            });

            fromEvent(this.input.nativeElement.ownerDocument, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                if (this.isSameRadioGroup(event.target)) {
                    this.syncStateFromInput();
                }
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
