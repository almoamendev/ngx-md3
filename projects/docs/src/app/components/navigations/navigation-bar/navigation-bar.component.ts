import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, Divider, IconButton, IconElement, MaterialIcon, NavigationBar, NavigationItem, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { NavBarConfig } from './nav-bar-config/nav-bar-config';

@Component({
    selector: 'app-navigation-bar',
    imports: [
        NavigationBar,
        NavigationItem,
        IconElement,
        MaterialIcon,
        IconButton,
        Badge,
        Playground,
        Divider,
        Shiki,
        TypeBody,
        RouterLink,
    ],
    templateUrl: './navigation-bar.component.html',
    styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent implements OnDestroy {
    private configSheet: SideSheetRef<NavBarConfig> | undefined;
    public configOpen = signal(false);

    public activeItem = signal<string>('home');
    public badge = signal<'none' | 'dot' | 'count'>('none');

    public apiImport: string = `// Component imports
import {
    NavigationBar,
    NavigationItem,
    IconElement,
    MaterialIcon, // optional
    Badge, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// NavigationBar has no configurable inputs.
// Its layout switches automatically between a horizontal bar
// (medium and expanded window sizes) and a vertical, compact
// bar (compact window size).`;

    public apiTypes: string = `// Types

// see NavigationItem and Badge on the navigation rail page
// for their full API`;

    public apiUsage: string = `<!-- Component usage -->

<md3-navigation-bar>
    <button type="button" md3-nav-item [class.md3-active]="isHomeActive">
        <md3-icon md3-icon-element>home</md3-icon>
        <!-- optional: filled icon swapped in when the item is active -->
        <md3-icon md3-icon-element="active" filled>home</md3-icon>
        Home
    </button>
</md3-navigation-bar>

<!-- active state is automatic when routerLink is present -->
<a routerLink="/home" md3-nav-item>
    <md3-icon md3-icon-element>home</md3-icon>
    Home
</a>

<!-- fully custom active condition, combined with the route match -->
<a #item="md3NavItem" routerLink="/inbox" md3-nav-item
    [class.md3-active]="item.isRouteActive && hasUnread()">
    <md3-icon md3-icon-element>mail</md3-icon>
    Inbox
</a>

<!-- item with a badge -->
<button type="button" md3-nav-item>
    <md3-badge small></md3-badge>
    <!-- or a numeric/text badge -->
    <!-- <md3-badge>9</md3-badge> -->
    <md3-icon md3-icon-element>mail</md3-icon>
    Mail
</button>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(NavBarConfig, {
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });
        this.configOpen.set(true);

        this.registerConfigEvents();

        this.configSheet.afterClosed().subscribe((_) => {
            this.configSheet = undefined;
            this.configOpen.set(false);
        });
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
    }

    private registerConfigEvents() {
        this.configSheet?.componentInstance?.badge.setValue(this.badge());
        this.configSheet?.componentInstance?.badge.registerOnChange(() => {
            this.badge.set(this.configSheet?.componentInstance?.badge.value);
        });
    }
}
