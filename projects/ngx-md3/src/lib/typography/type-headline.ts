import { Directive, ElementRef, Input } from '@angular/core';
import { TextColor } from '../types/text-color.type';

@Directive({
    selector: '[md3-type-headline]',
    host: {
        'class': 'md3-headline'
    }
})
export class TypeHeadline {
    @Input('md3-type-headline') size?: 'large' | 'medium' | 'small';
    @Input('color') color?: TextColor;

    constructor(public element: ElementRef) {
    }
}
