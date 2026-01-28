import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-display]',
    host: {
        'class': 'md3-display'
    }
})
export class TypeDisplay {
    @Input('md3-type-display') size?: 'large' | 'medium' | 'small';

    constructor(public element: ElementRef) {
    }
}
