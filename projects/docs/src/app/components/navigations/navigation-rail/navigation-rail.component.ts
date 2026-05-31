import { Component } from '@angular/core';
import { FloatingActionButton, IconElement, MaterialIcon, NavigationRail, Button, NavigationItem } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-navigation-rail.component',
    imports: [
        NavigationRail,
        FloatingActionButton,
        MaterialIcon,
        IconElement,
        NavigationItem,
        Button
    ],
    templateUrl: './navigation-rail.component.html',
    styleUrl: './navigation-rail.component.scss',
})
export class NavigationRailComponent {
    public hideMenuButton: boolean = false;
}
