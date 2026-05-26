import { Component } from '@angular/core';
import { Badge, IconElement, MaterialIcon, MenuGroup, MenuItem, TypeBody, TypeLabel, TypeTitle } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-smaple-menu',
    imports: [
        IconElement,
        MaterialIcon,
        MenuGroup,
        MenuItem,
        TypeLabel,
        TypeBody,
        TypeTitle,
        Badge,
    ],
    templateUrl: './smaple-menu.html',
    styleUrl: './smaple-menu.scss',
})
export class SmapleMenu {
}
