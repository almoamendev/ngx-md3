import { AfterContentInit, Component, ContentChild, ContentChildren, DestroyRef, ElementRef, Input, QueryList, ViewChild } from '@angular/core';
import { TextInput } from './text-input';
import { IconElement } from '../common/icon-element';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'md3-text-field',
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField implements AfterContentInit {
    @Input() label?: string;
    @Input() type: 'filled' | 'outlined' = 'filled';

    @ViewChild('inputContainer', { static: true }) inputContainer!: ElementRef<HTMLDivElement>;
    @ContentChild(TextInput) input?: TextInput;
    @ContentChildren(IconElement, { descendants: true }) iconElements?: QueryList<IconElement>;

    constructor(private destroyRef: DestroyRef) { }

    ngAfterContentInit(): void {
        if (this.input) {
            this.input.nativeElement.setAttribute('placeholder', '');
        }

        this.applyIconClasses();

        this.iconElements?.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.applyIconClasses();
        });
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
