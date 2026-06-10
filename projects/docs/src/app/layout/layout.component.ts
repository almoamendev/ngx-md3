import { Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppBarModule, IconElement, InputElement, MaterialIcon, NavigationBarModule, NavigationRailModule, ScaffoldModule, Switch } from '@vip9008/ngx-md3';
import { AppLayout } from './app-layout';

@Component({
    selector: 'app-layout',
    imports: [
        RouterLink,
        RouterOutlet,
        ScaffoldModule,
        AppBarModule,
        NavigationRailModule,
        NavigationBarModule,
        Switch,
        InputElement,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    host: {
        '[class.md3-scheme-dark]': 'darkMode()',
        '[class.md3-scheme-light]': '!darkMode()',
    },
})
export class LayoutComponent {
    public darkMode = computed<boolean>(() => this.layoutService.darkMode());

    constructor(
        private layoutService: AppLayout
    ) {
    }
}
