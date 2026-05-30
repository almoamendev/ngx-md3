import { Component } from '@angular/core';
import { FloatingActionButton, IconElement, MaterialIcon, NavigationRail } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-navigation-rail.component',
    imports: [
        NavigationRail,
        FloatingActionButton,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './navigation-rail.component.html',
    styleUrl: './navigation-rail.component.scss',
})
export class NavigationRailComponent {

}
