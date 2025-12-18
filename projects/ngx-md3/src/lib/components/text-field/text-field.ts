import { AfterContentInit, Component, ContentChild, ContentChildren, DestroyRef, ElementRef, Input, QueryList, ViewChild } from '@angular/core';
import { TextInput } from './text-input';
import { IconElement } from '../common/icon-element';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlName } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
    standalone: false,
    selector: 'md3-text-field',
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField implements AfterContentInit {
    @Input() label?: string;
    @Input() type: 'filled' | 'outlined' = 'filled';
    @Input() inputCounter: boolean | number = false;
    @Input() control?: AbstractControl;

    public hasError: boolean = false;
    public maxLength?: number;
    public valueLength: number = 0;

    @ViewChild('inputContainer', { static: true }) inputContainer!: ElementRef<HTMLDivElement>;
    @ContentChild(TextInput) input?: TextInput;
    @ContentChildren(IconElement, { descendants: true }) iconElements?: QueryList<IconElement>;
    @ContentChild(FormControlName) controlName?: FormControlName;

    constructor(private destroyRef: DestroyRef) {}

    ngAfterContentInit(): void {
        if (this.input) {
            this.input?.nativeElement.setAttribute('placeholder', '');

            if (this.input?.nativeElement.tagName.toLowerCase() == 'textarea') {
                this.input?.nativeElement.setAttribute('rows', '1');
            }

            this.valueLength = this.input?.nativeElement.value.length ?? 0;

            fromEvent(this.input?.nativeElement, 'input').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.valueLength = this.input?.nativeElement.value.length ?? 0;

                if (this.input?.nativeElement.tagName.toLowerCase() == 'textarea') {
                    this.input!.nativeElement.style.height = 'auto';
                    this.input!.nativeElement.style.height = this.input!.nativeElement.scrollHeight + 'px';
                }
            });
        }

        this.applyIconClasses();

        this.iconElements?.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.applyIconClasses();
        });

        this.updateInputValidity();

        this.formControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.updateInputValidity();
        });

        if (this.inputCounter != false) {
            this.maxLength = this.inputCounter === true ? undefined : Number(Number(this.inputCounter).toFixed(0));
        }
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

    private applyIconClasses(): void {
        const container = this.inputContainer?.nativeElement;
        if (!container) {
            return;
        }

        const hasLeading = this.iconElements?.some(i => i.iconType === 'leading') ?? false;
        const hasTrailing = this.iconElements?.some(i => i.iconType === 'trailing') ?? false;

        container.classList.toggle('has-leading-icon', hasLeading);
        container.classList.toggle('has-trailing-icon', hasTrailing);
    }
}
