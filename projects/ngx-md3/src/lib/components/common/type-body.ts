import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-body]',
    host: {
        'class': 'md3-body'
    }
})
export class TypeBody {
    @Input('md3-type-body') size: 'large' | 'medium' | 'small' = 'large';

    constructor(private el: ElementRef) {
        this.nativeElement.classList.add('md3-' + this.size);
    }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
