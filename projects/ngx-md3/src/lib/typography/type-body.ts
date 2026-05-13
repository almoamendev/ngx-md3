import { Directive, ElementRef, Input } from '@angular/core';
import { TextColor } from '../types/text-color.type';

@Directive({
    selector: '[md3-type-body]',
    host: {
        'class': 'md3-body'
    }
})
export class TypeBody {
    @Input('md3-type-body') size?: 'large' | 'medium' | 'small';
    @Input('color') color?: TextColor;

    constructor(public element: ElementRef) {
    }
}
