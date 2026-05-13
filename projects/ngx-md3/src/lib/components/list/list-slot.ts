import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-list-slot]',
    standalone: false
})
export class ListSlot {
    @Input({ alias: 'md3-list-slot', required: true }) position!: 'content' | 'trailing';

    constructor(private el: ElementRef) { }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
