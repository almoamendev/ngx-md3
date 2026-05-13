import { Directive, ElementRef, Input } from '@angular/core';
import { TextColor } from '../types/text-color.type';

@Directive({
    selector: '[md3-type-title]',
    host: {
        'class': 'md3-title'
    }
})
export class TypeTitle {
    @Input('md3-type-title') size?: 'large' | 'medium' | 'small';
    @Input('color') color?: TextColor;

    constructor(public element: ElementRef) {
    }
}
