import { booleanAttribute, Component, computed, effect, ElementRef, HostListener, inject, input, model } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { ButtonSize } from '../../../types/button-size.type';
import { ButtonType } from '../../../types/button-type.type';
import { MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';

@Component({
    selector: 'button[md3-button]',
    imports: [],
    templateUrl: './button.html',
    styleUrl: './button.scss',
    host: {
        '[class.md3-square]': 'effectiveSquared()',
    },
    hostDirectives: [
        StateComponent
    ],
})
export class Button {
    private context = inject(MD3_BUTTON_CONTEXT, { optional: true });
    
    @HostListener('click', ['$event']) onClick(event: PointerEvent): void {
        if (this.isSelected() === null) {
            return;
        }

        this.isSelected.update((value) => {
            return !value;
        });
    }

    public buttonSize = input<ButtonSize>('small', {
        alias: 'button-size',
    });
    public buttonType = input<ButtonType>('filled', {
        alias: 'button-type',
    });
    public isSquared = input<boolean, unknown>(false, {
        alias: 'button-squared',
        transform: booleanAttribute,
    });
    public isSelected = model<boolean | null>(null, {
        alias: 'selected',
    });

    public effectiveSize = computed(() => this.context?.buttonContextSize?.() ?? this.buttonSize());
    public effectiveType = computed(() => this.context?.buttonContextType?.() ?? this.buttonType());
    public effectiveSquared = computed(() => this.context?.buttonContextSquared?.() ?? this.isSquared());

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const size = 'md3-' + this.effectiveSize();
            this.element.classList.add(size);

            onCleanup(() => {
                this.element.classList.remove(size);
            });
        });

        effect((onCleanup) => {
            const type = 'md3-' + this.effectiveType();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });

        effect(() => {
            const toggle = this.isSelected() !== null;

            if (toggle) {
                this.element.classList.add('md3-toggle');
                this.element.classList.toggle('md3-selected', this.isSelected() ?? false);
            } else {
                this.element.classList.remove('md3-toggle', 'md3-selected');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    public enableSelection() {
        this.isSelected.update((current) => {
            if (current !== null) {
                return current;
            }

            return false;
        });
    }
}
