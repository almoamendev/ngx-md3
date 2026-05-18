import { AfterContentInit, Component, ContentChild, DestroyRef, effect, ElementRef, input, Input, signal, viewChild, ViewChild } from '@angular/core';
import { StateComponent } from '../common/state-component';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlName } from '@angular/forms';

@Component({
    selector: 'md3-checkbox',
    imports: [
        MaterialIcon,
        StateComponent,
    ],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
})
export class Checkbox implements AfterContentInit {
    @Input() control?: AbstractControl;

    private stateComponent = viewChild<StateComponent>(StateComponent);

    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;
    
    public readonly disableStateLayer = input<boolean>(false, {
        alias: 'disable-state-layer'
    });
    
    public checkboxIcon: 'check_small' | 'check_indeterminate_small' = 'check_small';
    public hasError: boolean = false;
    public state = signal<boolean | null>(false);

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
        })
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

    private updateState(state: boolean | null = false): void {
        this.checkboxIcon = state === null
            ? 'check_indeterminate_small'
            : 'check_small';

        this.state.set(state);
    }

    private syncStateFromInput(): void {
        if (!this.input?.nativeElement) {
            return;
        }

        if (this.input.nativeElement.indeterminate) {
            this.updateState(null);
            return;
        }

        this.updateState(this.input.nativeElement.checked);
    }

    private syncInputFromState(state: boolean | null = false): void {
        if (!this.input?.nativeElement) {
            return;
        }

        this.input.nativeElement.indeterminate = state === null;
        this.input.nativeElement.checked = state === true;
    }

    private syncControlFromState(state: boolean | null = false): void {
        if (!this.formControl || this.formControl.value === state) {
            return;
        }

        this.formControl.setValue(state);
    }

    private syncStateFromControl(): void {
        if (!this.formControl) {
            return;
        }

        let controlState = this.formControl.value === null
            ? null
            : this.formControl.value === true;

        this.updateState(controlState);
        this.syncInputFromState(controlState);
    }

    ngAfterContentInit(): void {
        if (this.input?.nativeElement) {
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

    private setState(state: boolean | null = false) {
        if (this.input?.nativeElement) {
            this.input.nativeElement.indeterminate = state === null;
            this.input.nativeElement.checked = state === true;
            this.input.nativeElement.dispatchEvent(new Event('change'));
        }

        this.updateState(state);
        this.syncControlFromState(state);
    }
}
