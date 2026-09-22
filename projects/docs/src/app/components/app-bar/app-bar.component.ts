import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppBar, AppBarHeader, AppBarScrollingStyle, AppBarType, Avatar, IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, TypeDisplay } from '@almoamendev/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';
import { AppBarConfig } from './app-bar-config/app-bar-config';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-app-bar',
    imports: [
        AppBar,
        AppBarHeader,
        IconButton,
        IconElement,
        MaterialIcon,
        Avatar,
        InputElement,
        Playground,
        Shiki,
        TypeDisplay,
        RouterLink,
    ],
    templateUrl: './app-bar.component.html',
    styleUrl: './app-bar.component.scss',
})
export class AppBarComponent implements OnDestroy {
    private configSheet: SideSheetRef<AppBarConfig> | undefined;
    public configOpen = signal(false);

    public barType = signal<AppBarType>('small');
    public customHeader = signal<boolean>(false);
    public scrollStyle = signal<AppBarScrollingStyle>('elevate');
    public autoHide = signal<boolean>(false);
    public centerAligned = signal<boolean>(false);

    private sanitizer = inject(DomSanitizer);

    public logo: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(`
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 74">
        <path fill="#1e92ff" d="m46.2 24.78l-41.57 22.6 34.43 18.72c4.45 2.42 9.82 2.42 14.28 0l25.43-13.83c3.88-2.11 3.88-7.67 0-9.78 0 0-32.57-17.71-32.57-17.71z"/>
        <path fill-rule="evenodd" fill="#603bea" d="m46.2 49.22l-41.57-1.84 41.57-22.6 41.56 1.84-41.56 22.6z"/>
        <path fill="#7d4dff" d="m39.06 7.9l-25.44 13.83c-3.87 2.11-3.87 7.67 0 9.77l32.58 17.71 41.56-22.59-34.43-18.72c-4.45-2.42-9.82-2.42-14.27 0z"/>
        <g>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m109.62 22.68v22.53h9v6.36h-16.51v-28.89c0 0 7.51 0 7.51 0z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m120.61 37.13q0-3.22 1.19-6 1.19-2.78 3.29-4.85 2.11-2.06 5.04-3.23 2.93-1.17 6.46-1.17 3.48 0 6.43 1.17 2.95 1.17 5.08 3.23 2.12 2.07 3.31 4.85 1.19 2.78 1.19 6 0 3.21-1.19 5.99-1.19 2.78-3.31 4.85-2.13 2.07-5.08 3.24-2.95 1.16-6.43 1.16-3.53 0-6.46-1.16-2.93-1.17-5.04-3.24-2.1-2.07-3.29-4.85-1.19-2.78-1.19-5.99zm7.85 0q0 1.72 0.66 3.18 0.65 1.45 1.76 2.53 1.11 1.07 2.58 1.66 1.48 0.59 3.13 0.59 1.64 0.01 3.12-0.59 1.47-0.59 2.6-1.66 1.13-1.08 1.78-2.53 0.66-1.46 0.66-3.18-0.01-1.73-0.66-3.18-0.65-1.46-1.78-2.53-1.13-1.07-2.6-1.67-1.48-0.59-3.12-0.59-1.65 0-3.13 0.59-1.47 0.6-2.58 1.67-1.11 1.07-1.76 2.53-0.66 1.45-0.66 3.18z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m181.37 51.57h-9.35l-7.16-11.11v11.11h-7.51v-28.89h11.68q2.42 0 4.22 0.71 1.8 0.71 2.97 1.94 1.17 1.22 1.76 2.83 0.59 1.61 0.59 3.45 0 3.29-1.59 5.34-1.59 2.05-4.69 2.78c0 0 9.08 11.84 9.08 11.84zm-16.51-15.98h1.42q2.22 0 3.4-0.92 1.19-0.92 1.19-2.64 0-1.72-1.19-2.64-1.18-0.92-3.4-0.92h-1.42c0 0 0 7.12 0 7.12z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m200.95 29.04h-8.93v4.83h8.43v6.36h-8.43v4.98h8.93v6.36h-16.44v-28.89h16.44c0 0 0 6.36 0 6.36z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m205.05 51.57l4.9-28.89h7.43l5.79 15.4 5.74-15.4h7.44l4.9 28.89h-7.47l-2.49-16.63-6.82 16.63h-2.99l-6.47-16.63-2.49 16.63z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m253.51 22.68v22.53h9v6.36h-16.51v-28.89c0 0 7.51 0 7.51 0z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m264.5 37.13q0-3.22 1.19-6 1.19-2.78 3.3-4.85 2.1-2.06 5.04-3.23 2.92-1.17 6.45-1.17 3.48 0 6.44 1.17 2.95 1.17 5.07 3.23 2.13 2.07 3.32 4.85 1.18 2.78 1.18 6 0 3.21-1.18 5.99-1.19 2.78-3.32 4.85-2.12 2.07-5.07 3.24-2.95 1.16-6.44 1.16-3.53 0-6.45-1.16-2.94-1.17-5.04-3.24-2.11-2.07-3.3-4.85-1.19-2.78-1.19-5.99zm7.86 0q0 1.72 0.65 3.18 0.65 1.45 1.76 2.53 1.11 1.07 2.59 1.66 1.47 0.59 3.12 0.59 1.65 0.01 3.12-0.59 1.48-0.59 2.61-1.66 1.13-1.08 1.78-2.53 0.65-1.46 0.65-3.18 0-1.73-0.65-3.18-0.65-1.46-1.78-2.53-1.13-1.07-2.61-1.67-1.47-0.59-3.12-0.59-1.65 0-3.12 0.59-1.48 0.6-2.59 1.67-1.11 1.07-1.76 2.53-0.65 1.45-0.65 3.18z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m315.3 35.4h14.91q0 2.3-0.2 4.18-0.19 1.88-0.76 3.48-0.81 2.26-2.19 4.01-1.37 1.74-3.23 2.91-1.86 1.17-4.08 1.78-2.22 0.61-4.68 0.61-3.37 0-6.15-1.11-2.77-1.11-4.77-3.12-1.99-2.01-3.1-4.83-1.11-2.81-1.11-6.22 0-3.37 1.09-6.19 1.09-2.82 3.11-4.81 2.01-1.99 4.84-3.1 2.84-1.11 6.32-1.11 4.52 0 7.93 1.95 3.41 1.95 5.41 6.05l-7.13 2.95q-1-2.37-2.59-3.41-1.59-1.03-3.62-1.03-1.68 0-3.06 0.63-1.38 0.63-2.36 1.8-0.97 1.17-1.53 2.82-0.55 1.65-0.55 3.68 0 1.84 0.47 3.41 0.48 1.57 1.44 2.72 0.96 1.15 2.38 1.78 1.41 0.63 3.29 0.63 1.11 0 2.15-0.25 1.03-0.25 1.86-0.8 0.82-0.56 1.35-1.44 0.54-0.88 0.73-2.15h-6.16c0 0 0-5.82-0.01-5.82z"/>
            <path fill="rgb(var(--md-scheme-on-surface))" d="m333.65 37.13q0-3.22 1.19-6 1.19-2.78 3.3-4.85 2.1-2.06 5.04-3.23 2.92-1.17 6.45-1.17 3.48 0 6.44 1.17 2.95 1.17 5.07 3.23 2.13 2.07 3.32 4.85 1.18 2.78 1.18 6 0 3.21-1.18 5.99-1.19 2.78-3.32 4.85-2.12 2.07-5.07 3.24-2.95 1.16-6.44 1.16-3.53 0-6.45-1.16-2.94-1.17-5.04-3.24-2.11-2.07-3.3-4.85-1.19-2.78-1.19-5.99zm7.86 0q0 1.72 0.65 3.18 0.65 1.45 1.76 2.53 1.11 1.07 2.59 1.66 1.47 0.59 3.12 0.59 1.65 0.01 3.12-0.59 1.48-0.59 2.61-1.66 1.13-1.08 1.78-2.53 0.65-1.46 0.65-3.18 0-1.73-0.65-3.18-0.65-1.46-1.78-2.53-1.13-1.07-2.61-1.67-1.47-0.59-3.12-0.59-1.65 0-3.12 0.59-1.48 0.6-2.59 1.67-1.11 1.07-1.76 2.53-0.65 1.45-0.65 3.18z"/>
        </g>
    </svg>
    `);

    public apiImport: string = `// Component import
import { 
    AppBar,
    AppBarHeader, // optional
    IconButton, // optional
    IconElement, // optional
    MaterialIcon, // optional
    Avatar, // optional
    InputElement, // optional
 } from '@almoamendev/ngx-md3';`;

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
import { AppBarType, AppBarScrollingStyle } from '@almoamendev/ngx-md3';

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

<!-- with a custom header instead of a title/subtitle -->
<md3-app-bar>
    <a href="/" md3-app-bar-header>
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
        effect(() => {
            if (this.barType() == 'search') {
                this.configSheet?.componentInstance?.customHeader.disable();
            } else {
                this.configSheet?.componentInstance?.customHeader.enable();
            }
        });
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

        this.configSheet?.componentInstance?.customHeader.setValue(this.customHeader());
        this.configSheet?.componentInstance?.customHeader.registerOnChange(() => {
            this.customHeader.set(this.configSheet?.componentInstance?.customHeader.value!);
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

        if (this.barType() == 'search') {
            this.configSheet?.componentInstance?.customHeader.disable();
        } else {
            this.configSheet?.componentInstance?.customHeader.enable();
        }
    }
}
