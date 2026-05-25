import { booleanAttribute, Component, effect, ElementRef, input, Input, signal } from '@angular/core';

@Component({
    selector: 'md3-menu',
    imports: [],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
    host: {
        'role': 'menu',
    },
})
export class Menu {
    @Input('menu-color') set color(value: 'standard' | 'vibrant') {
        this.menuColors.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };

    private menuColors = signal<'standard' | 'vibrant'>('standard');

    public isActive = input<boolean, unknown>(true, {
        alias: 'is-active',
        transform: booleanAttribute,
    });
    
    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    constructor(private el: ElementRef) {
        effect(() => {
            const color = this.menuColors();
            this.element.classList.add('md3-' + color);
        });

        effect(() => {
            const active = this.isActive();
            if (this.isActive()) {
                this.element.classList.remove('md3-inactive');
            } else {
                this.element.classList.add('md3-inactive');
            }
        });
    }
}
