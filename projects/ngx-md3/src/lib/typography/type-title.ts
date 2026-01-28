import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-title]',
    host: {
        'class': 'md3-title'
    }
})
export class TypeTitle {
    @Input('md3-type-title') size?: 'large' | 'medium' | 'small';

    constructor(public element: ElementRef) {
    }
}
