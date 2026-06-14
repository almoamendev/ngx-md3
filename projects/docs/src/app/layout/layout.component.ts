import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppBarModule, IconElement, InputElement, LayoutService, MaterialIcon, NavigationBarModule, NavigationRailModule, ScaffoldModule, SheetsService, SideSheetConfig, SideSheetRef, Switch } from '@vip9008/ngx-md3';
import { FormControl } from '@angular/forms';
import { ComponentsMenu } from './components-menu/components-menu';

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

    private navSheetsConfig: SideSheetConfig = {
        // data: { title: 'First sheet' },
        side: 'start',
        type: 'standard',
        inset: false,
        closeExisting: true,
        bindDataToInputs: true,
    }

    private currentSheet: SideSheetRef | undefined;

    constructor(
        private layoutService: LayoutService,
        private sheetsService: SheetsService
    ) {
        this.darkModeControl.setValue(this.layoutService.darkMode());

        this.darkModeControl.registerOnChange(() => {
            this.layoutService.darkMode.set(this.darkModeControl.value);
        });
    }

    public openComponentsMenu(): void {
        const isCurrentSheet: boolean = (this.currentSheet?.componentInstance as ComponentsMenu)?.id == 'components';

        this.currentSheet?.close();

        if (!isCurrentSheet) {
            this.currentSheet = this.sheetsService.openSideSheet(ComponentsMenu, this.navSheetsConfig);
            this.currentSheet.afterClosed().subscribe((_) => {
                this.currentSheet = undefined;
            });
        }
    }
}
