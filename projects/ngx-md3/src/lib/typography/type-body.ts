import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-body]',
    host: {
        'class': 'md3-body'
    }
})
export class TypeBody {
    @Input('md3-type-body') size?: 'large' | 'medium' | 'small';

    constructor(public element: ElementRef) {
    }
}
