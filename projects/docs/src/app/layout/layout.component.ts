import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppBarModule, IconElement, InputElement, LayoutService, MaterialIcon, NavigationBarModule, NavigationRailModule, ScaffoldModule, Switch } from '@vip9008/ngx-md3';
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
})
export class LayoutComponent {
    public darkModeControl: FormControl = new FormControl<boolean>(false);

    constructor(
        private layoutService: LayoutService
    ) {
        this.darkModeControl.setValue(this.layoutService.darkMode());

        this.darkModeControl.registerOnChange(() => {
            this.layoutService.darkMode.set(this.darkModeControl.value);
        });
    }
}
