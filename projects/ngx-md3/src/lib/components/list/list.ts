import { booleanAttribute, Component, effect, ElementRef, input } from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';

@Component({
    selector: 'md3-list',
    templateUrl: './list.html',
    styleUrl: './list.scss',
    hostDirectives: [
        {
            directive: CdkDropList,
            outputs: ['cdkDropListDropped: dropped'],
        },
    ],
})
export class List {
    public variant = input<'expressive' | 'baseline'>('expressive');
    public type = input<'standard' | 'segmented'>('standard');
    public draggable = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    constructor(
        private el: ElementRef,
        private dropList: CdkDropList
    ) {
        this.dropList.lockAxis = 'y';

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

        effect(() => {
            this.dropList.disabled = !this.draggable();
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
