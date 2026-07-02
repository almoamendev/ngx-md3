import { Component, effect, ElementRef, input } from '@angular/core';

@Component({
    selector: 'md3-list',
    templateUrl: './list.html',
    styleUrl: './list.scss',
})
export class List {
    public variant = input<'expressive' | 'baseline'>('expressive');
    public type = input<'standard' | 'segmented'>('standard');

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const variant = 'md3-' + this.variant();
            this.element.classList.add(variant);

            onCleanup(() => {
                this.element.classList.remove(variant);
            });
        });

        effect((onCleanup) => {
            const type = 'md3-' + this.type();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
