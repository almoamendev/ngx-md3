import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
    selector: 'md3-menu-group',
    imports: [],
    templateUrl: './menu-group.html',
    styleUrl: './menu-group.scss',
    host: {
        'role': 'group',
    },
})
export class MenuGroup {
}
