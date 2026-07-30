import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';
import { ScaffoldConfig } from './scaffold-config/scaffold-config';

@Component({
  selector: 'app-scaffold.component',
  imports: [
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        RouterLink,
    ],
    templateUrl: './scaffold.component.html',
    styleUrl: './scaffold.component.scss',
})
export class ScaffoldComponent implements OnDestroy {
    private configSheet: SideSheetRef<ScaffoldConfig> | undefined;
    public configOpen = signal(false);

    public showTopBar = signal<boolean>(true);
    public showBottomBar = signal<boolean>(false);
    public showLeadingRail = signal<boolean>(true);
    public showTrailingRail = signal<boolean>(false);
    public showStartPane = signal<boolean>(false);
    public showEndPane = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Scaffold,
    ScaffoldBar, // optional
    ScaffoldRail, // optional
    ScaffoldPane, // recommended: always project main content pane
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// md3-scaffold-bar
public region = input.required<'top' | 'bottom'>({
    alias: 'md3-scaffold-bar',
});

// md3-scaffold-rail
public region = input.required<'leading' | 'trailing'>({
    alias: 'md3-scaffold-rail',
});

// md3-scaffold-pane
public role = input.required<'main' | 'start' | 'end'>({
    alias: 'md3-scaffold-pane',
});`;

    public apiUsage: string = `<!-- Component usage -->

<md3-scaffold>
    <md3-app-bar md3-scaffold-bar="top">
        ...
    </md3-app-bar>

    <md3-navigation-rail md3-scaffold-rail="leading">
        ...
    </md3-navigation-rail>

    <!-- optional, only rendered when projected -->
    <div md3-scaffold-pane="start">
        ...
    </div>

    <main md3-scaffold-pane="main">
        <router-outlet></router-outlet>
    </main>

    <div md3-scaffold-pane="end">
        ...
    </div>

    <md3-navigation-rail md3-scaffold-rail="trailing">
        ...
    </md3-navigation-rail>

    <md3-navigation-bar md3-scaffold-bar="bottom">
        ...
    </md3-navigation-bar>
</md3-scaffold>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ScaffoldConfig, {
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
        this.configSheet?.componentInstance?.showTopBar.setValue(this.showTopBar());
        this.configSheet?.componentInstance?.showTopBar.registerOnChange(() => {
            this.showTopBar.set(this.configSheet?.componentInstance?.showTopBar.value);
        });

        this.configSheet?.componentInstance?.showBottomBar.setValue(this.showBottomBar());
        this.configSheet?.componentInstance?.showBottomBar.registerOnChange(() => {
            this.showBottomBar.set(this.configSheet?.componentInstance?.showBottomBar.value);
        });

        this.configSheet?.componentInstance?.showLeadingRail.setValue(this.showLeadingRail());
        this.configSheet?.componentInstance?.showLeadingRail.registerOnChange(() => {
            this.showLeadingRail.set(this.configSheet?.componentInstance?.showLeadingRail.value);
        });

        this.configSheet?.componentInstance?.showTrailingRail.setValue(this.showTrailingRail());
        this.configSheet?.componentInstance?.showTrailingRail.registerOnChange(() => {
            this.showTrailingRail.set(this.configSheet?.componentInstance?.showTrailingRail.value);
        });

        this.configSheet?.componentInstance?.showStartPane.setValue(this.showStartPane());
        this.configSheet?.componentInstance?.showStartPane.registerOnChange(() => {
            this.showStartPane.set(this.configSheet?.componentInstance?.showStartPane.value);
        });

        this.configSheet?.componentInstance?.showEndPane.setValue(this.showEndPane());
        this.configSheet?.componentInstance?.showEndPane.registerOnChange(() => {
            this.showEndPane.set(this.configSheet?.componentInstance?.showEndPane.value);
        });
    }
}
