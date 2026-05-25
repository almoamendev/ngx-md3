import { Component } from '@angular/core';
import { IconElement, MaterialIcon, Menu, MenuGroup, MenuItem } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-menus',
    imports: [
        IconElement,
        MaterialIcon,
        Menu,
        MenuGroup,
        MenuItem,
    ],
    templateUrl: './menus.component.html',
    styleUrl: './menus.component.scss',
})
export class MenusComponent {

}
