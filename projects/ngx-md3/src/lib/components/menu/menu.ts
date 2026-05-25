import { Component, Input } from '@angular/core';

@Component({
    selector: 'md3-menu',
    imports: [],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
    host: {
        'class': 'md3-menu',
        'role': 'menu',
        '[attr.aria-label]': 'ariaLabel',
        '[class.md3-menu-compact]': 'density === "compact"',
        '[class.md3-menu-wide]': 'width === "wide"',
        '[class.md3-menu-full]': 'width === "full"',
    },
})
export class Menu {
    @Input('aria-label') ariaLabel?: string;
    @Input('menu-density') density: 'default' | 'compact' = 'default';
    @Input('menu-width') width: 'default' | 'wide' | 'full' = 'default';
}
