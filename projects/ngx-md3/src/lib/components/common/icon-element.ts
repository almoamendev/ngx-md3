import { Directive, ElementRef, input } from '@angular/core';

@Directive({
    selector: '[md3-icon-element]',
    host: {
        'class': 'md3-icon-element'
    }
})
export class IconElement {
    public iconType = input<string | null>(null, {
        alias: 'md3-icon-element',
    });

    constructor(private el: ElementRef) { }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
