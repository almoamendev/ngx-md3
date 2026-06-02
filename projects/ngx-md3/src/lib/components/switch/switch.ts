import { AfterContentInit, Component, ContentChild, DestroyRef, effect, ElementRef, input, Input, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputElement } from '../common/input-element';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-switch',
    imports: [
        StateComponent
    ],
    templateUrl: './switch.html',
    styleUrl: './switch.scss',
})
export class Switch implements AfterContentInit {
    @Input() control?: AbstractControl;
    
    private stateComponent = viewChild<StateComponent>(StateComponent);

    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;

    public disableStateLayer = input<boolean>(false, {
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

    private syncControlFromState(state: boolean = false): void {
        if (!this.formControl || this.formControl.value === state) {
            return;
        }

        this.formControl.setValue(state);
    }

    private syncStateFromControl(): void {
        if (!this.formControl) {
            return;
        }

        const controlState = this.formControl.value === true;

        this.updateState(controlState);
        this.syncInputFromState(controlState);
    }

    ngAfterContentInit(): void {
        if (this.input?.nativeElement) {
            this.input.nativeElement.setAttribute('role', 'switch');

            fromEvent(this.input.nativeElement, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.syncStateFromInput();
                this.syncControlFromState(this.state());
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
