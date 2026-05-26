import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-icon-element]',
    host: {
        'class': 'md3-icon-element'
    }
})
export class IconElement {
    @Input('md3-icon-element') iconType?: string;

    constructor(private el: ElementRef) { }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
