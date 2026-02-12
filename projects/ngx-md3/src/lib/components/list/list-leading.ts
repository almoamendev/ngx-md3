import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[md3-list-leading]',
    standalone: false
})
export class ListLeading {
    @Input('md3-list-leading') type: 'icon' | 'avatar' | 'media' = 'icon';

    constructor(private el: ElementRef) { }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }
}
