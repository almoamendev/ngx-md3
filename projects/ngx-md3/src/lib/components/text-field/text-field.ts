import { AfterContentInit, Component, ContentChild, ContentChildren, DestroyRef, ElementRef, Input, QueryList, ViewChild } from '@angular/core';
import { TextInput } from './text-input';
import { IconElement } from '../common/icon-element';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControlName } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'md3-text-field',
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField implements AfterContentInit {
    @Input() label?: string;
    @Input() type: 'filled' | 'outlined' = 'filled';
    @Input() control?: AbstractControl;

    @ViewChild('inputContainer', { static: true }) inputContainer!: ElementRef<HTMLDivElement>;
    @ContentChild(TextInput) input?: TextInput;
    @ContentChildren(IconElement, { descendants: true }) iconElements?: QueryList<IconElement>;
    @ContentChild(FormControlName) controlName?: FormControlName;

    constructor(private destroyRef: DestroyRef) { }

    ngAfterContentInit(): void {
        this.input?.nativeElement.setAttribute('placeholder', '');

        this.applyIconClasses();

        this.iconElements?.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.applyIconClasses();
        });

        this.formControl?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (this.formControl?.invalid && (this.formControl?.touched || this.formControl?.dirty)) {
                this.input?.nativeElement.setAttribute('aria-invalid', 'true');
            } else {
                this.input?.nativeElement.setAttribute('aria-invalid', 'false');
            }
        });
    }

    public get formControl(): AbstractControl | undefined {
        if (this.control) {
            return this.control;
        }

        return this.controlName?.control;
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
