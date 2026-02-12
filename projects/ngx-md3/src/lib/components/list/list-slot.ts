import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-list-slot]',
    standalone: false
})
export class ListSlot {
    @Input('md3-list-slot') position!: string;

    constructor(private el: ElementRef) { }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
