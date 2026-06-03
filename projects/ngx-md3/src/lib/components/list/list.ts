import { Component, effect, ElementRef, input } from '@angular/core';

@Component({
    selector: 'md3-list',
    standalone: false,
    templateUrl: './list.html',
    styleUrl: './list.scss',
})
export class List {
    public variant = input<'expressive' | 'baseline'>('expressive');
    public type = input<'standard' | 'segmented'>('standard');

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.variant());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.variant());
            });
        });

        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.type());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.type());
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
