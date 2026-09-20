import { Component } from '@angular/core';
import { MenuGroup } from '../../menu/menu-group/menu-group';
import { MenuItem } from '../../menu/menu-item/menu-item';

@Component({
    selector: 'md3-select-options',
    imports: [
        MenuGroup,
        MenuItem,
    ],
    templateUrl: './select-options.html',
    styleUrl: './select-options.scss',
})
export class SelectOptions {
}
