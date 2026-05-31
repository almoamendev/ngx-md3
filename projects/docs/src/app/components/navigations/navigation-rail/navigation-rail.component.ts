import { Component } from '@angular/core';
import { NavigationRailModule, Button } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-navigation-rail',
    imports: [
        NavigationRailModule,
        Button
    ],
    templateUrl: './navigation-rail.component.html',
    styleUrl: './navigation-rail.component.scss',
})
export class NavigationRailComponent {
    public hideMenuButton: boolean = false;
}
