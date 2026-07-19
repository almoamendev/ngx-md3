import { Component, OnDestroy, signal } from '@angular/core';
import { AppBar, AppBarLogo, AppBarScrollingStyle, AppBarType, Avatar, IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef } from '@vip9008/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';
import { AppBarConfig } from './app-bar-config/app-bar-config';

@Component({
    selector: 'app-app-bar',
    imports: [
        AppBar,
        AppBarLogo,
        IconButton,
        IconElement,
        MaterialIcon,
        Avatar,
        InputElement,
        Playground,
        Shiki,
    ],
    templateUrl: './app-bar.component.html',
    styleUrl: './app-bar.component.scss',
})
export class AppBarComponent implements OnDestroy {
    private configSheet: SideSheetRef<AppBarConfig> | undefined;
    public configOpen = signal(false);

    public barType = signal<AppBarType>('small');
    public scrollStyle = signal<AppBarScrollingStyle>('elevate');
    public autoHide = signal<boolean>(false);
    public centerAligned = signal<boolean>(false);

    public apiImport: string = `// Component import
import { AppBarModule } from '@vip9008/ngx-md3';
// AppBar is declared in an NgModule (not standalone) because its
// template depends on several other directives internally`;

    public apiData: string = `public title = input<string | null>(null, {
    alias: 'bar-title',
});
public subtitle = input<string | null>(null, {
    alias: 'bar-subtitle',
});
public appBarType = input<AppBarType>('small', {
    alias: 'bar-type',
});
public appBarScrollingStyle = input<AppBarScrollingStyle>('elevate', {
    alias: 'scroll-style',
});
public autoHide = input(false, {
    alias: 'auto-hide',
    transform: booleanAttribute,
});
public centerAligned = input(false, {
    alias: 'center-aligned',
    transform: booleanAttribute,
});`;

    public apiTypes: string = `// Types
import { AppBarType, AppBarScrollingStyle } from '@vip9008/ngx-md3';

type AppBarType = 'small' | 'medium' | 'large' | 'search';
type AppBarScrollingStyle = 'none' | 'transparent' | 'elevate';`;

    public apiUsage: string = `<!-- Component usage, typically as the scaffold's top bar -->

<md3-app-bar bar-title="Screen title" bar-subtitle="Subtitle" bar-type="small" scroll-style="elevate" md3-scaffold-bar="top">
    <button md3-app-bar-leading md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>menu</md3-icon>
    </button>

    <button md3-app-bar-trailing md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>search</md3-icon>
    </button>
    <button md3-app-bar-trailing md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>more_vert</md3-icon>
    </button>

    <a href="/profile" md3-avatar>
        <img src="/img/avatar.jpg" alt="Profile">
    </a>
</md3-app-bar>

<!-- with a logo instead of a title/subtitle -->
<md3-app-bar>
    <a href="/" md3-app-bar-logo>
        <img src="/img/logo.svg" alt="Company logo">
    </a>
</md3-app-bar>

<!-- search variant: replaces the title area with a search field -->
<md3-app-bar bar-type="search">
    <button md3-search-leading md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>arrow_back</md3-icon>
    </button>
    <input md3-input-element type="text" placeholder="Search">
    <button md3-search-trailing md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>search</md3-icon>
    </button>
</md3-app-bar>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(AppBarConfig, {
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
        this.configSheet?.componentInstance?.barType.setValue(this.barType());
        this.configSheet?.componentInstance?.barType.registerOnChange(() => {
            this.barType.set(this.configSheet?.componentInstance?.barType.value!);
        });

        this.configSheet?.componentInstance?.scrollStyle.setValue(this.scrollStyle());
        this.configSheet?.componentInstance?.scrollStyle.registerOnChange(() => {
            this.scrollStyle.set(this.configSheet?.componentInstance?.scrollStyle.value!);
        });

        this.configSheet?.componentInstance?.autoHide.setValue(this.autoHide());
        this.configSheet?.componentInstance?.autoHide.registerOnChange(() => {
            this.autoHide.set(this.configSheet?.componentInstance?.autoHide.value!);
        });

        this.configSheet?.componentInstance?.centerAligned.setValue(this.centerAligned());
        this.configSheet?.componentInstance?.centerAligned.registerOnChange(() => {
            this.centerAligned.set(this.configSheet?.componentInstance?.centerAligned.value!);
        });
    }
}
