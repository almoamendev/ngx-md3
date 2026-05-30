import { Directive, ElementRef, Input } from '@angular/core';
import { TextColor } from '../../types/text-color.type';

@Directive({
    selector: '[md3-type-label]',
    host: {
        'class': 'md3-label'
    }
})
export class TypeLabel {
    @Input('md3-type-label') size?: 'large' | 'medium' | 'small';
    @Input('color') color?: TextColor;

    constructor(public element: ElementRef) {
    }
}
