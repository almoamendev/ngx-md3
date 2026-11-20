import { booleanAttribute, Directive, ElementRef, input } from '@angular/core';

@Directive({
    selector: 'md3-badge',
    host: {
        '[class.md3-small]': 'isSmall()',
    },
})
export class Badge {
    public isSmall = input<boolean, unknown>(false, {
        alias: 'small',
        transform: booleanAttribute,
    });

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
