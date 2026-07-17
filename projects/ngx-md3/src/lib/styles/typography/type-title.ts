import { Directive, ElementRef, input } from '@angular/core';
import { TextColor } from '../../types/text-color.type';
import { TextSize } from '../../types/text-size.type';

@Directive({
    selector: 'md3-type-title, [md3-type-title]',
    host: {
        'class': 'md3-title'
    }
})
export class TypeTitle {
    public size = input<TextSize | undefined>(undefined);
    public color = input<TextColor | undefined>(undefined);

    constructor(public element: ElementRef) {
    }
}
