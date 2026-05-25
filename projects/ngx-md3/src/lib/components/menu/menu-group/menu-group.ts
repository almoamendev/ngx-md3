import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
    selector: 'md3-menu-group',
    imports: [],
    templateUrl: './menu-group.html',
    styleUrl: './menu-group.scss',
    host: {
        'class': 'md3-menu-group',
        'role': 'group',
        '[attr.aria-label]': 'label',
        '[class.md3-menu-group-divider]': 'divider',
    },
})
export class MenuGroup {
    @Input('group-label') label?: string;
    @Input({ transform: booleanAttribute }) divider = false;
}
