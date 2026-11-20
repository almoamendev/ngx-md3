import { computed, Directive, input, numberAttribute } from '@angular/core';

@Directive({
    selector: 'md3-grid-item, [md3-grid-item]',
    host: {
        'class': 'md3-grid-item',
        '[style.grid-column]': 'span()',
    }
})
export class GridItem {
    public readonly colSpan = input(1, {
        alias: 'col-span',
        transform: numberAttribute,
    });

    protected readonly span = computed(() => `span ${this.colSpan()}`);
}
