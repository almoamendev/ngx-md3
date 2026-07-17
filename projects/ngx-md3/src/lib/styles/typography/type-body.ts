import { Directive, ElementRef, input } from '@angular/core';
import { TextColor } from '../../types/text-color.type';
import { TextSize } from '../../types/text-size.type';

@Directive({
    selector: 'md3-type-body, [md3-type-body]',
    host: {
        'class': 'md3-body'
    }
})
export class TypeBody {
    public size = input<TextSize | undefined>(undefined);
    public color = input<TextColor | undefined>(undefined);

    constructor(public element: ElementRef) {
    }
}
