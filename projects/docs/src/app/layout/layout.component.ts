import { Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppBarModule, IconElement, InputElement, MaterialIcon, NavigationBarModule, NavigationRailModule, ScaffoldModule, Switch } from '@vip9008/ngx-md3';
import { AppLayout } from './app-layout';
import { FormControl } from '@angular/forms';

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
        '[class.md-scheme-dark]': 'darkMode()',
        '[class.md-scheme-light]': '!darkMode()',
    },
})
export class LayoutComponent {
    public darkMode = computed<boolean>(() => this.layoutService.darkMode());
    public darkModeControl: FormControl = new FormControl<boolean>(false);

    constructor(
        private layoutService: AppLayout
    ) {
        this.darkModeControl.setValue(this.darkMode());

        this.darkModeControl.registerOnChange(() => {
            this.layoutService.darkMode.set(this.darkModeControl.value);
        });
    }
}
