import { booleanAttribute, Component, computed, effect, ElementRef, HostListener, inject, input, model } from '@angular/core';
import { ButtonSize } from '../types/button-size.type';
import { ButtonType } from '../types/button-type.type';
import { MD3_BUTTON_CONTEXT } from '../interfaces/button-context.interface';
import { StateComponent } from '@almoamendev/ngx-md3/core';

@Component({
    selector: 'button[md3-button], a[md3-button]',
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
    
    @HostListener('click', ['$event']) onClick(event: Event): void {
        if (this.isSelected() === null) {
            return;
        }

        if (this.context?.buttonContextSelection?.() === 'single') {
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

        // a toggle exposes its state to assistive tech through aria-pressed. The
        // attribute is removed only when this button set it, so an aria-pressed
        // the app manages itself on a plain button is left alone.
        let ownsAriaPressed = false;
        effect(() => {
            const selected = this.isSelected();

            if (selected !== null) {
                this.element.classList.add('md3-toggle');
                this.element.classList.toggle('md3-selected', selected);
                this.element.setAttribute('aria-pressed', String(selected));
                ownsAriaPressed = true;
            } else {
                this.element.classList.remove('md3-toggle', 'md3-selected');
                if (ownsAriaPressed) {
                    this.element.removeAttribute('aria-pressed');
                    ownsAriaPressed = false;
                }
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    public enableSelection(): boolean {
        let enabled = false;

        this.isSelected.update((current) => {
            if (current !== null) {
                return current;
            }

            enabled = true;
            return false;
        });

        return enabled;
    }
}
