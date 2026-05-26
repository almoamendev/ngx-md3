import { booleanAttribute, Directive, effect, ElementRef, input } from '@angular/core';

@Directive({
    selector: 'md3-badge',
})
export class Badge {
    public isSmall = input<boolean, unknown>(false, {
        alias: 'small',
        transform: booleanAttribute,
    });

    constructor(private el: ElementRef) {
        effect(() => {
            if (this.isSmall()) {
                this.element.classList.add('md3-small');
            } else {
                this.element.classList.remove('md3-small');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
