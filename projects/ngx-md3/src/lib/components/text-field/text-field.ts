import { Component, computed, contentChild, contentChildren, DestroyRef, effect, ElementRef, input, viewChild } from '@angular/core';
import { InputElement } from '../common/input-element';
import { IconElement } from '../common/icon-element';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { IconButton } from '../buttons/icon-button/icon-button';

@Component({
    standalone: false,
    selector: 'md3-text-field',
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField {
    public label = input<string | null>(null, {
        alias: 'label',
    });
    public type = input<'filled' | 'outlined'>('filled', {
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

    public formControl = computed<AbstractControl | undefined>(() => {
        if (this.control()) {
            return this.control();
        }

        return this.controlName()?.control;
    });

    public inputError = computed<boolean>(() => {
        if (this.formControl()) {
            return this.formControl()!.invalid && (this.formControl()!.touched || this.formControl()!.dirty);
        }

        return !(this.input()?.nativeElement.validity.valid ?? true) || this.input()?.nativeElement.ariaInvalid === 'true';
    });

    public maxLength = computed<number | undefined>(() => {
        if (!this.inputCounter() || this.inputCounter() === true) {
            return undefined;
        }

        return Number(Number(this.inputCounter()).toFixed(0));
    });
    public valueLength: number = 0;

    constructor(private destroyRef: DestroyRef) {
        effect(() => {
            this.iconButtons().forEach((iconButton) => {
                iconButton.buttonSize.set('small');
            });
        });

        effect(() => {
            const input = this.input();
            if (!input) {
                return;
            }
            
            this.input()?.nativeElement.setAttribute('placeholder', '');
            this.valueLength = this.input()?.nativeElement.value.length ?? 0;

            if (this.input()?.nativeElement.tagName.toLowerCase() == 'textarea') {
                this.input()?.nativeElement.setAttribute('rows', '1');
            }

            fromEvent(this.input()!.nativeElement, 'input').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.valueLength = this.input()?.nativeElement.value.length ?? 0;

                if (this.input()?.nativeElement.tagName.toLowerCase() == 'textarea') {
                    this.input()!.nativeElement.style.height = 'auto';
                    this.input()!.nativeElement.style.height = this.input()!.nativeElement.scrollHeight + 'px';
                }
            });
        });

        effect(() => {
            const container = this.inputContainer()?.nativeElement;
            if (!container) {
                return;
            }

            const hasLeading: boolean = this.iconElements().some(i => i.iconType === 'leading') ?? false;
            const hasTrailing: boolean = (this.iconElements().some(i => i.iconType === 'trailing') || !!this.iconButtons().length) ?? false;

            container.classList.toggle('md3-has-leading-icon', hasLeading);
            container.classList.toggle('md3-has-trailing-icon', hasTrailing);
        });

        effect(() => {
            if (this.inputError()) {
                this.input()?.nativeElement.setAttribute('aria-invalid', 'true');
            } else {
                this.input()?.nativeElement.setAttribute('aria-invalid', 'false');
            }
        });
    }
}
