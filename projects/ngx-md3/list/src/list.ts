import { booleanAttribute, Component, effect, ElementRef, inject, Injector, input } from '@angular/core';
import { LIST_REORDER_STATE } from './list-reorder-state';

@Component({
    selector: 'md3-list',
    templateUrl: './list.html',
    styleUrl: './list.scss',
})
export class List {
    public variant = input<'expressive' | 'baseline'>('expressive');
    public type = input<'standard' | 'segmented'>('standard');
    /**
     * Lets the items be reordered by dragging. Needs `LIST_REORDER` from
     * `@almoamendev/ngx-md3/list-reorder` in the component's imports.
     */
    public draggable = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    private injector = inject(Injector);

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

        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            let warned = false;

            effect(() => {
                // Looked up here, not in the constructor: ListReorder injects this list.
                if (!warned && this.draggable() && !this.injector.get(LIST_REORDER_STATE, null, { self: true, optional: true })) {
                    warned = true;
                    console.warn(
                        'md3-list has `draggable` but reordering is not loaded. Add LIST_REORDER from ' +
                        '@almoamendev/ngx-md3/list-reorder to the imports of the component that uses this list.'
                    );
                }
            });
        }
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
