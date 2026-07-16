import { Component } from '@angular/core';
import { Badge, IconElement, MaterialIcon, NavigationBar, NavigationItem } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-navigation-bar.component',
    imports: [
        NavigationBar,
        NavigationItem,
        IconElement,
        MaterialIcon,
        Badge,
    ],
    templateUrl: './navigation-bar.component.html',
    styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {

}
