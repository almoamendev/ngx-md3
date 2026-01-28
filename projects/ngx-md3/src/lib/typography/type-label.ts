import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-label]',
    host: {
        'class': 'md3-label'
    }
})
export class TypeLabel {
    @Input('md3-type-label') size?: 'large' | 'medium' | 'small';

    constructor(public element: ElementRef) {
    }
}
