import { Component, effect, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { AppBarModule, IconElement, InputElement, LayoutService, MaterialIcon, NavigationBarModule, NavigationRailModule, ScaffoldModule, SheetsService, SideSheetConfig, SideSheetRef, Switch } from '@vip9008/ngx-md3';
import { FormControl } from '@angular/forms';
import { ComponentsMenu } from './components-menu/components-menu';
import { filter } from 'rxjs';

enum NavigationGroupLink {
    COMPONENTS = 'components',
}

@Component({
    selector: 'app-layout',
    imports: [
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
    public expandedRail = signal<boolean>(false);
    public showMenuBtn = signal<boolean>(false);
    public darkModeControl: FormControl = new FormControl<boolean>(false);

    private navSheetsConfig: SideSheetConfig = {
        // data: { title: 'First sheet' },
        side: 'start',
        type: 'default',
        inset: true,
        closeExisting: true,
        bindDataToInputs: true,
    }

    private currentSheet: SideSheetRef | undefined;

    public currentGroup = signal<NavigationGroupLink | null>(null);
    public groupType = NavigationGroupLink;

    constructor(
        private layoutService: LayoutService,
        private sheetsService: SheetsService,
        private router: Router,
    ) {
        this.darkModeControl.setValue(this.layoutService.darkMode());

        this.darkModeControl.registerOnChange(() => {
            this.layoutService.darkMode.set(this.darkModeControl.value);
        });

        effect(() => {
            if (this.layoutService.isMedium()) {
                this.currentSheet?.close();
            }

            if (this.layoutService.isCompact()) {
                this.currentSheet?.close();
                this.showMenuBtn.set(true);
            } else {
                this.expandedRail.set(false);
                this.showMenuBtn.set(false);
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            if (this.layoutService.isCompact()) {
                this.currentSheet?.close();
                this.expandedRail.set(false);
            }
        });
    }

    public openComponentsMenu(): void {
        const isCurrentGroup: boolean = this.currentGroup() == NavigationGroupLink.COMPONENTS;

        this.currentSheet?.close();

        if (!isCurrentGroup) {
            this.currentSheet = this.sheetsService.openSideSheet(ComponentsMenu, this.navSheetsConfig);
            this.currentGroup.set(NavigationGroupLink.COMPONENTS);
            this.currentSheet.afterClosed().subscribe((_) => {
                this.cleanCurrentSheet();
            });
        }
    }

    private cleanCurrentSheet(): void {
        this.currentSheet = undefined;
        this.currentGroup.set(null);
    }
}
