import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[md3-input-element]',
    host: {
        'class': 'md3-input-element'
    }
})
export class InputElement {
    constructor(private el: ElementRef<HTMLInputElement>) { }

    public get nativeElement(): HTMLInputElement {
        return this.el.nativeElement;
    }
}
