import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-headline]',
    host: {
        'class': 'md3-headline'
    }
})
export class TypeHeadline {
    @Input('md3-type-headline') size?: 'large' | 'medium' | 'small';

    constructor(public element: ElementRef) {
    }
}
