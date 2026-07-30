import { Component, effect, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, Divider, FloatingActionButton, IconButton, IconElement, MaterialIcon, NavigationGroup, NavigationItem, NavigationRail, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { NavRailConfig } from './nav-rail-config/nav-rail-config';

@Component({
    selector: 'app-navigation-rail',
    imports: [
        NavigationRail,
        NavigationGroup,
        NavigationItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
        Badge,
        Playground,
        Divider,
        Shiki,
        TypeBody,
        RouterLink,
    ],
    templateUrl: './navigation-rail.component.html',
    styleUrl: './navigation-rail.component.scss',
})
export class NavigationRailComponent implements OnDestroy {
    private configSheet: SideSheetRef<NavRailConfig> | undefined;
    public configOpen = signal(false);

    public activeItem = signal<string>('home');

    public expanded = signal<boolean>(false);
    public hideMenuButton = signal<boolean>(false);
    public fullWidthIndicator = signal<boolean>(false);
    public containerStyle = signal<'none' | 'elevated' | 'divider'>('none');
    public collapsedLayout = signal<'compact' | 'narrow' | 'hidden'>('compact');
    public expandedLayout = signal<'standard' | 'modal'>('standard');
    public showFab = signal<boolean>(false);
    public badge = signal<'none' | 'dot' | 'count'>('none');

    public apiImport: string = `// Component imports
import {
    NavigationRail,
    NavigationGroup, // optional
    NavigationItem,
    IconElement,
    MaterialIcon, // optional
    FloatingActionButton, // optional
    Badge, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public expanded = model<boolean>(false, {
    alias: 'expanded',
});
public hideMenuButton = input<boolean, unknown>(false, {
    alias: 'hide-menu-button',
    transform: booleanAttribute,
});
public fullWidthIndicator = input<boolean, unknown>(false, {
    alias: 'full-width-indicator',
    transform: booleanAttribute,
});
public containerStyle = input<ContainerStyle>('none', {
    alias: 'container-style',
});
public collapsedMode = input<CollapsedLayout>('compact', {
    alias: 'collapsed-layout',
});
public expandedMode = input<ExpandedLayout>('standard', {
    alias: 'expanded-layout',
});`;

    public apiTypes: string = `// Types

// inline unions, not exported as named types
type ContainerStyle = 'none' | 'elevated' | 'divider';
type CollapsedLayout = 'compact' | 'narrow' | 'hidden';
type ExpandedLayout = 'standard' | 'modal';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- basic navigation rail -->
<md3-navigation-rail>
    <button type="button" md3-nav-item [class.md3-active]="isHomeActive">
        <md3-icon md3-icon-element>home</md3-icon>
        <!-- optional: filled icon swapped in when the item is active -->
        <md3-icon md3-icon-element="active" filled>home</md3-icon>
        Home
    </button>
</md3-navigation-rail>

<!-- active state is automatic when routerLink is present -->
<a routerLink="/home" md3-nav-item>
    <md3-icon md3-icon-element>home</md3-icon>
    Home
</a>

<!-- customize route matching -->
<a routerLink="/settings" [routerLinkActiveOptions]="{ exact: true }" md3-nav-item>
    <md3-icon md3-icon-element>settings</md3-icon>
    Settings
</a>

<!-- fully custom active condition, combined with the route match -->
<a #item="md3NavItem" routerLink="/inbox" md3-nav-item
    [class.md3-active]="item.isRouteActive && hasUnread()">
    <md3-icon md3-icon-element>mail</md3-icon>
    Inbox
</a>

<!-- grouping items -->
<md3-navigation-rail>
    <md3-nav-group label="Library" hide-on-collapse>
        <button type="button" md3-nav-item>...</button>
        <button type="button" md3-nav-item>...</button>
    </md3-nav-group>
</md3-navigation-rail>

<!-- item with a badge -->
<button type="button" md3-nav-item>
    <md3-badge small></md3-badge>
    <!-- or a numeric/text badge -->
    <!-- <md3-badge>9</md3-badge> -->
    <md3-icon md3-icon-element>mail</md3-icon>
    Mail
</button>

<!-- with a floating action button -->
<md3-navigation-rail>
    <button type="button" md3-fab>
        <md3-icon md3-icon-element>edit</md3-icon>
    </button>
    ...
</md3-navigation-rail>

<!-- custom expand/collapse menu icons -->
<md3-navigation-rail>
    <md3-icon md3-icon-element="expand">menu</md3-icon>
    <md3-icon md3-icon-element="collapse">menu_open</md3-icon>
    ...
</md3-navigation-rail>

<!-- two-way expanded binding -->
<md3-navigation-rail [(expanded)]="expandedRail">
    ...
</md3-navigation-rail>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
        effect(() => {
            const isExpanded = this.expanded();
            this.configSheet?.componentInstance?.expanded.setValue(isExpanded ? true : false);
        });

        effect(() => {
            if (this.collapsedLayout() == 'hidden') {
                this.configSheet?.componentInstance?.containerStyle.disable();
            } else {
                this.configSheet?.componentInstance?.containerStyle.enable();
            }
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(NavRailConfig, {
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
        this.configSheet?.componentInstance?.expanded.setValue(this.expanded());
        this.configSheet?.componentInstance?.expanded.registerOnChange(() => {
            this.expanded.set(this.configSheet?.componentInstance?.expanded.value);
        });

        this.configSheet?.componentInstance?.hideMenuButton.setValue(this.hideMenuButton());
        this.configSheet?.componentInstance?.hideMenuButton.registerOnChange(() => {
            this.hideMenuButton.set(this.configSheet?.componentInstance?.hideMenuButton.value);
        });

        this.configSheet?.componentInstance?.fullWidthIndicator.setValue(this.fullWidthIndicator());
        this.configSheet?.componentInstance?.fullWidthIndicator.registerOnChange(() => {
            this.fullWidthIndicator.set(this.configSheet?.componentInstance?.fullWidthIndicator.value);
        });

        this.configSheet?.componentInstance?.showFab.setValue(this.showFab());
        this.configSheet?.componentInstance?.showFab.registerOnChange(() => {
            this.showFab.set(this.configSheet?.componentInstance?.showFab.value);
        });

        this.configSheet?.componentInstance?.badge.setValue(this.badge());
        this.configSheet?.componentInstance?.badge.registerOnChange(() => {
            this.badge.set(this.configSheet?.componentInstance?.badge.value);
        });

        this.configSheet?.componentInstance?.containerStyle.setValue(this.containerStyle());
        this.configSheet?.componentInstance?.containerStyle.registerOnChange(() => {
            this.containerStyle.set(this.configSheet?.componentInstance?.containerStyle.value);
        });

        this.configSheet?.componentInstance?.collapsedLayout.setValue(this.collapsedLayout());
        this.configSheet?.componentInstance?.collapsedLayout.registerOnChange(() => {
            this.collapsedLayout.set(this.configSheet?.componentInstance?.collapsedLayout.value);
        });

        this.configSheet?.componentInstance?.expandedLayout.setValue(this.expandedLayout());
        this.configSheet?.componentInstance?.expandedLayout.registerOnChange(() => {
            this.expandedLayout.set(this.configSheet?.componentInstance?.expandedLayout.value);
        });
    }
}
