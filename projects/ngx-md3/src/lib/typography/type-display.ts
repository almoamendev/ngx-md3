import { Directive, ElementRef, Input } from '@angular/core';
import { TextColor } from '../types/text-color.type';

@Directive({
    selector: '[md3-type-display]',
    host: {
        'class': 'md3-display'
    }
})
export class TypeDisplay {
    @Input('md3-type-display') size?: 'large' | 'medium' | 'small';
    @Input('color') color?: TextColor;

    constructor(public element: ElementRef) {
    }
}
