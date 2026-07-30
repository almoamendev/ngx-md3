import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Shiki } from '../../shiki/shiki';

@Component({
    selector: 'app-navigation-item',
    imports: [
        Shiki,
        RouterLink,
    ],
    templateUrl: './navigation-item.component.html',
    styleUrl: './navigation-item.component.scss',
})
export class NavigationItemComponent {
    public apiImport: string = `// Component imports
import { NavigationItem } from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public hideOnCollapse = input<boolean, unknown>(false, {
    alias: 'hide-on-collapse',
    transform: booleanAttribute,
});

// Forwarded from Angular's RouterLinkActive via hostDirectives
routerLinkActiveOptions: input<IsActiveMatchOptions | boolean>
ariaCurrentWhenActive: input<AriaCurrentWhenActive>

// Read-only
get isRouteActive(): boolean; // reflects RouterLinkActive's current match state`;

    public apiTypes: string = `// Types

// IsActiveMatchOptions and the type below are Angular's own (from '@angular/router'),
// not redefined by NavigationItem.
type AriaCurrentWhenActive = 'page' | 'step' | 'location' | 'date' | 'time' | true | 'false';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- inside a navigation bar or rail -->
<a routerLink="/home" md3-nav-item>
    <md3-icon md3-icon-element>home</md3-icon>
    <!-- optional: filled icon swapped in when the item is active -->
    <md3-icon md3-icon-element="active" filled>home</md3-icon>
    Home
</a>

<!-- no routerLink: toggle active state manually -->
<button type="button" md3-nav-item [class.md3-active]="isHomeActive">
    <md3-icon md3-icon-element>home</md3-icon>
    Home
</button>

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

<!-- hide entirely while the parent rail is collapsed -->
<button type="button" md3-nav-item hide-on-collapse>
    <md3-icon md3-icon-element>star</md3-icon>
    Extras
</button>`;
}
