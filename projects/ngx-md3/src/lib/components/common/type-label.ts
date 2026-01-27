import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-type-label]',
    host: {
        'class': 'md3-label'
    }
})
export class TypeLabel {
    @Input('md3-type-label') size: 'large' | 'medium' | 'small' = 'large';

    constructor(private el: ElementRef) {
        this.nativeElement.classList.add('md3-' + this.size);
    }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
