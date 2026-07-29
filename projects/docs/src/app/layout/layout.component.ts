import { Component, computed, effect, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { AppBar, IconElement, InputElement, LayoutService, MaterialIcon, NavigationItem, NavigationRail, Scaffold, ScaffoldBar, ScaffoldPane, ScaffoldRail, SheetsService, SideSheetConfig, SideSheetRef, SideSheetType, Switch } from '@vip9008/ngx-md3';
import { FormControl } from '@angular/forms';
import { ComponentsMenu } from './components-menu/components-menu';
import { filter } from 'rxjs';
import { FoundationsMenu } from './foundations-menu/foundations-menu';
import { StylesMenu } from './styles-menu/styles-menu';

enum NavigationGroupLink {
    FOUNDATIONS = 'foundations',
    COMPONENTS = 'components',
    STYLES = 'styles',
}

@Component({
    selector: 'app-layout',
    imports: [
        RouterOutlet,
        RouterLink,
        Scaffold,
        ScaffoldBar,
        ScaffoldRail,
        ScaffoldPane,
        AppBar,
        Switch,
        InputElement,
        MaterialIcon,
        IconElement,
        NavigationRail,
        NavigationItem,
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
        // type: 'default',
        inset: true,
        closeExisting: true,
        bindDataToInputs: true,
    }

    private currentSheet: SideSheetRef | undefined;

    public currentGroup = signal<NavigationGroupLink | null>(null);
    public groupType = NavigationGroupLink;
    public navSheetStyle = computed<SideSheetType>(() => {
        if (this.layoutService.isLarge() || this.layoutService.isExtraLarge()) {
            return 'default';
        }

        return 'modal';
    });

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
            const type = this.navSheetStyle();
            if (type == 'modal') {
                this.currentSheet?.close();
            }

            this.currentSheet?.setSheetType(type);
        });

        effect(() => {
            if (this.layoutService.isCompact()) {
                this.showMenuBtn.set(true);
            } else {
                this.expandedRail.set(false);
                this.showMenuBtn.set(false);
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            if (this.navSheetStyle() == 'modal') {
                this.currentSheet?.close();
            }

            if (this.layoutService.isCompact()) {
                this.expandedRail.set(false);
            }
        });
    }

    private getMenu(group: NavigationGroupLink): any {
        switch(group) {
            case NavigationGroupLink.FOUNDATIONS: return FoundationsMenu;
            case NavigationGroupLink.STYLES: return StylesMenu;
            case NavigationGroupLink.COMPONENTS: return ComponentsMenu;
        }
    }

    public openMenu(group: NavigationGroupLink): void {
        const isCurrentGroup: boolean = this.currentGroup() == group;

        this.currentSheet?.close();

        const menu = this.getMenu(group);

        if (!isCurrentGroup && menu) {
            this.navSheetsConfig.type = this.navSheetStyle();
            this.currentSheet = this.sheetsService.openSideSheet(menu, this.navSheetsConfig);
            this.currentGroup.set(group);
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
