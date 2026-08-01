import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@almoamendev/ngx-md3';
import { BadgeConfig } from './badge-config/badge-config';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';

@Component({
    selector: 'app-badges',
    imports: [
        Badge,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
        RouterLink,
    ],
    templateUrl: './badges.component.html',
    styleUrl: './badges.component.scss',
})
export class BadgesComponent implements OnDestroy {
    private configSheet: SideSheetRef<BadgeConfig> | undefined;
    public configOpen = signal(false);

    public badgeType = signal<'dot' | 'count' | 'overflow' | 'text'>('dot');

    public apiImport: string = `// Component imports
import {
    Badge,
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// Inputs
public isSmall = input<boolean, unknown>(false, {
    alias: 'small',
    transform: booleanAttribute,
});`;

    public apiUsage: string = `<!-- Component usage -->

<!-- dot badge, shows that new information is available without a count -->
<button md3-icon-button button-type="standard">
    <md3-badge small></md3-badge>
    <md3-icon md3-icon-element>notifications</md3-icon>
</button>

<!-- large badge with a count -->
<button md3-icon-button button-type="standard">
    <md3-badge>1</md3-badge>
    <md3-icon md3-icon-element>notifications</md3-icon>
</button>

<!-- large badge with an overflow count -->
<button md3-icon-button button-type="standard">
    <md3-badge>999+</md3-badge>
    <md3-icon md3-icon-element>notifications</md3-icon>
</button>

<!-- large badge with a short text label -->
<button md3-icon-button button-type="standard">
    <md3-badge>NEW</md3-badge>
    <md3-icon md3-icon-element>notifications</md3-icon>
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

        this.configSheet = this.sheetsService.openSideSheet(BadgeConfig, {
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
        this.configSheet?.componentInstance?.badgeType.setValue(this.badgeType());
        this.configSheet?.componentInstance?.badgeType.registerOnChange(() => {
            this.badgeType.set(this.configSheet?.componentInstance?.badgeType.value);
        });
    }
}
