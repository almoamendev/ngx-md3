import { computed, Directive, inject } from '@angular/core';
import { LayoutService } from './layout.service';
import { ViewportWidth } from '../types/viewport-width.type';

const GRID_COLUMNS_BY_WIDTH: Record<ViewportWidth, number> = {
    'compact': 4,
    'medium': 8,
    'expanded': 12,
    'large': 12,
    'extra-large': 12,
};

@Directive({
    selector: 'md3-grid, [md3-grid]',
    host: {
        'class': 'md3-grid',
        '[style.--md-grid-columns]': 'columns()',
    }
})
export class Grid {
    private readonly layout = inject(LayoutService);

    protected readonly columns = computed(() => GRID_COLUMNS_BY_WIDTH[this.layout.widthClass()]);
}
