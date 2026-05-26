import { Component } from '@angular/core';
import { Badge, IconElement, MaterialIcon, Menu, MenuGroup, MenuItem, TypeBody, TypeLabel, TypeTitle } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-menus',
    imports: [
        IconElement,
        MaterialIcon,
        Menu,
        MenuGroup,
        MenuItem,
        TypeLabel,
        TypeBody,
        TypeTitle,
        Badge,
    ],
    templateUrl: './menus.component.html',
    styleUrl: './menus.component.scss',
})
export class MenusComponent {

}
