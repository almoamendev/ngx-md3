import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-title]',
    host: {
        'class': 'md3-title'
    }
})
export class TypeTitle {
    @Input('md3-type-title') size: 'large' | 'medium' | 'small' = 'large';

    constructor(private el: ElementRef) {
        this.nativeElement.classList.add('md3-' + this.size);
    }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
