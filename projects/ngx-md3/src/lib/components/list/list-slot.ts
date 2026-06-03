import { Directive, ElementRef, input } from '@angular/core';

@Directive({
    selector: '[md3-list-slot]',
    standalone: false,
    host: {
        '[attr.md3-list-slot]': 'position()',
    },
})
export class ListSlot {
    public position = input.required<'content' | 'trailing'>({
        alias: 'md3-list-slot',
    });

    constructor(private el: ElementRef) { }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
