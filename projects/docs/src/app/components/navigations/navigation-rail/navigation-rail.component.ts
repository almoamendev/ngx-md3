import { Component } from '@angular/core';
import { Badge, FloatingActionButton, IconButton, IconElement, MaterialIcon, NavigationGroup, NavigationItem, NavigationRail } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-navigation-rail',
    imports: [
        NavigationRail,
        NavigationGroup,
        NavigationItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
        Badge,
    ],
    templateUrl: './navigation-rail.component.html',
    styleUrl: './navigation-rail.component.scss',
})
export class NavigationRailComponent {
    public hideMenuButton: boolean = false;
}
