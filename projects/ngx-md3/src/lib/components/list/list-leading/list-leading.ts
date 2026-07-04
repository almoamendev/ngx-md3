import { Component, effect, ElementRef, input } from '@angular/core';
import { ListLeadingType } from '../../../types/list-leading-type.type';
import { ListLeadingSize } from '../../../types/list-leading-size.type';

@Component({
    selector: 'md3-list-leading',
    templateUrl: './list-leading.html',
    styleUrl: './list-leading.scss',
})
export class ListLeading {
    public type = input<ListLeadingType>('icon');
    public size = input<ListLeadingSize>('image');

    constructor(
        private el: ElementRef,
    ) {
        effect((onCleanup) => {
            const type = 'md3-type-' + this.type();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });

        effect((onCleanup) => {
            const size = 'md3-size-' + this.size();
            this.element.classList.add(size);

            onCleanup(() => {
                this.element.classList.remove(size);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
