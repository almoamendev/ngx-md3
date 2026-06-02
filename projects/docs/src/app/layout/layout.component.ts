import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { NavigationBarModule, NavigationRailModule, ScaffoldModule } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-layout',
    imports: [
        RouterLink,
        RouterOutlet,
        ScaffoldModule,
        NavigationRailModule,
        NavigationBarModule,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {

}
