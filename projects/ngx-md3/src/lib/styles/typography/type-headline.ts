import { booleanAttribute, Directive, effect, ElementRef, input } from '@angular/core';
import { TextColor } from '../../types/text-color.type';
import { TextSize } from '../../types/text-size.type';

@Directive({
    selector: 'md3-type-headline, [md3-type-headline]',
    host: {
        'class': 'md3-text-headline',
        '[class.emphasized]': 'emphasized()',
    }
})
export class TypeHeadline {
    public size = input<TextSize | 'default'>('default');
    public color = input<TextColor | 'default'>('default');
    public emphasized = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    constructor(public el: ElementRef) {
        effect((onCleanup) => {
            const size = 'md3-text-' + this.size();
            this.element.classList.add(size);

            onCleanup(() => {
                this.element.classList.remove(size);
            });
        });

        effect((onCleanup) => {
            const color = 'md3-color-' + this.size();
            this.element.classList.add(color);

            onCleanup(() => {
                this.element.classList.remove(color);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
