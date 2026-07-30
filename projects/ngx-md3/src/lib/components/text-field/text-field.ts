import { Component, computed, contentChild, contentChildren, effect, ElementRef, input, signal, Signal, viewChild } from '@angular/core';
import { InputElement } from '../common/input-element';
import { IconElement } from '../common/icon-element';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { IconButton } from '../buttons/icon-button/icon-button';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { ButtonSize } from '../../types/button-size.type';
import { NgClass } from '@angular/common';

@Component({
    selector: 'md3-text-field',
    imports: [
        NgClass,
    ],
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: TextField,
        },
    ],
})
export class TextField implements ButtonContext {
    public label = input<string | null>(null, {
        alias: 'label',
    });
    public fieldType = input<'filled' | 'outlined'>('filled', {
        alias: 'field-type',
    });
    public inputCounter = input<boolean | number>(false, {
        alias: 'input-counter',
    });
    public control = input<AbstractControl>(undefined, {
        alias: 'control',
    });

    private inputContainer = viewChild<ElementRef>('inputContainer');
    private input = contentChild(InputElement);
    private iconElements = contentChildren(IconElement, { descendants: true });
    private iconButtons = contentChildren(IconButton, { descendants: true });
    private controlName = contentChild(FormControlName);
    private controlError = signal(false);
    private nativeInputError = signal(false);
    // Tracks the last aria-invalid value this component itself wrote, so
    // hasNativeInputError() can tell a self-authored value apart from one set
    // externally. See hasNativeInputError() for why that distinction matters.
    private lastSyncedAriaInvalid: string | null = null;

    public formControl = computed<AbstractControl | undefined>(() => {
        if (this.control()) {
            return this.control();
        }

        return this.controlName()?.control;
    });

    public inputError = computed<boolean>(() => {
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

    public maxLength = computed<number | undefined>(() => {
        const counter = this.inputCounter();

        if (!counter || counter === true) {
            return undefined;
        }

        return Number(Number(counter).toFixed(0));
    });
    public valueLength = signal(0);
    
    // context values
    buttonContextSize: Signal<ButtonSize> = signal('small');

    constructor() {
        effect((onCleanup) => {
            const input = this.input();
            if (!input) {
                return;
            }

            const nativeInput = input.nativeElement;
            const isTextarea = nativeInput.tagName.toLowerCase() === 'textarea';
            
            nativeInput.setAttribute('placeholder', '');
            this.syncNativeInputState(nativeInput);

            if (isTextarea) {
                nativeInput.setAttribute('rows', '1');
            }

            const inputEvents = merge(
                fromEvent(nativeInput, 'input'),
                fromEvent(nativeInput, 'change'),
                fromEvent(nativeInput, 'blur'),
                fromEvent(nativeInput, 'invalid'),
            ).subscribe(() => {
                this.syncNativeInputState(nativeInput);

                if (isTextarea) {
                    nativeInput.style.height = 'auto';
                    nativeInput.style.height = nativeInput.scrollHeight + 'px';
                }
            });

            const observer = typeof MutationObserver === 'undefined'
                ? undefined
                : new MutationObserver(() => this.syncNativeInputState(nativeInput));
            observer?.observe(nativeInput, {
                attributes: true,
                attributeFilter: ['aria-invalid', 'disabled', 'maxlength', 'minlength', 'pattern', 'required'],
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

            this.syncControlError(control);

            const controlEvents = control.events.subscribe(() => this.syncControlError(control));

            onCleanup(() => controlEvents.unsubscribe());
        });

        effect(() => {
            const container = this.inputContainer()?.nativeElement;
            if (!container) {
                return;
            }

            const hasLeading: boolean = this.iconElements().some(i => i.iconType() === 'leading') ?? false;
            const hasTrailing: boolean = (this.iconElements().some(i => i.iconType() === 'trailing') || !!this.iconButtons().length) ?? false;

            container.classList.toggle('md3-has-leading-icon', hasLeading);
            container.classList.toggle('md3-has-trailing-icon', hasTrailing);
        });

        effect(() => {
            this.syncAriaInvalidAttribute(this.input()?.nativeElement);
        });
    }

    private syncNativeInputState(input: HTMLInputElement): void {
        this.valueLength.set(input.value.length);
        this.nativeInputError.set(this.hasNativeInputError(input));
    }

    private syncControlError(control: AbstractControl): void {
        this.controlError.set(this.hasControlError(control));
    }

    private hasNativeInputError(input: HTMLInputElement): boolean {
        const ariaInvalid = input.getAttribute('aria-invalid');

        // aria-invalid is also written by syncAriaInvalidAttribute() below,
        // based on this very computation. Without excluding our own last
        // write, a validity error that gets flagged once can never clear:
        // the native 'input'/'change' handler would keep reading back the
        // (still-true, self-authored) attribute from the previous cycle
        // before the effect that's about to correct it has had a chance to
        // run. Comparing against lastSyncedAriaInvalid means only a value
        // that didn't come from us — i.e. set externally, such as by a
        // consumer's own validation — counts as an error signal here.
        const externallyFlaggedInvalid = ariaInvalid === 'true' && ariaInvalid !== this.lastSyncedAriaInvalid;

        return !input.validity.valid || externallyFlaggedInvalid;
    }

    private hasControlError(control: AbstractControl): boolean {
        return control.invalid && (control.touched || control.dirty);
    }

    private syncAriaInvalidAttribute(input: HTMLInputElement | undefined): void {
        if (!input) {
            return;
        }

        const value = this.inputError() ? 'true' : 'false';
        this.lastSyncedAriaInvalid = value;

        if (input.getAttribute('aria-invalid') !== value) {
            input.setAttribute('aria-invalid', value);
        }
    }
}
