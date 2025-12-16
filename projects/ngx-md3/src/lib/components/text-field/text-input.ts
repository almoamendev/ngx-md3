import { Directive, ElementRef } from '@angular/core';

@Directive({
    standalone: false,
    selector: '[md3-text-input]',
    host: {
        'class': 'md3-text-input'
    }
})
export class TextInput {
    constructor(private el: ElementRef<HTMLInputElement>) { }

    public get nativeElement(): HTMLInputElement {
        return this.el.nativeElement;
    }
}
