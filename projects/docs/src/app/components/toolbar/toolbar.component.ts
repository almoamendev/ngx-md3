import { Component, computed, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FloatingActionButton, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, Toolbar, ToolbarAlignment, ToolbarColor, ToolbarItem, ToolbarOrientation, ToolbarScrollAction, ToolbarType, TypeDisplay } from '@almoamendev/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';
import { ToolbarConfig, ToolbarOrientationChoice } from './toolbar-config/toolbar-config';

@Component({
    selector: 'app-toolbar',
    imports: [
        Toolbar,
        ToolbarItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
        Playground,
        Shiki,
        TypeDisplay,
        RouterLink,
    ],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnDestroy {
    private configSheet: SideSheetRef<ToolbarConfig> | undefined;
    public configOpen = signal(false);

    public toolbarType = signal<ToolbarType>('floating');
    public toolbarColor = signal<ToolbarColor>('standard');
    public orientationChoice = signal<ToolbarOrientationChoice>('auto');
    public alignment = signal<ToolbarAlignment>('center');
    public scrollAction = signal<ToolbarScrollAction>('none');
    public fabPosition = signal<'start' | 'end'>('end');
    public showFab = signal<boolean>(false);
    public persistentItem = signal<boolean>(false);

    /** `auto` is the unset input, so the component falls back to the region. */
    public orientation = computed<ToolbarOrientation | null>(() => {
        const choice = this.orientationChoice();
        return choice === 'auto' ? null : choice;
    });

    public apiImport: string = `// Component import
import {
    Toolbar,
    IconButton, // optional
    IconElement, // optional
    MaterialIcon, // optional
    ButtonGroup, // optional
    FloatingActionButton, // optional
 } from '@almoamendev/ngx-md3';`;

    public apiData: string = `public toolbarType = input<ToolbarType>('floating', {
    alias: 'toolbar-type',
});
public toolbarColor = input<ToolbarColor>('standard', {
    alias: 'toolbar-color',
});
public orientation = input<ToolbarOrientation | null>(null, {
    alias: 'orientation',
});
public alignment = input<ToolbarAlignment>('center', {
    alias: 'alignment',
});
public scrollAction = input<ToolbarScrollAction>('none', {
    alias: 'scroll-action',
});
public fabPosition = input<'start' | 'end'>('end', {
    alias: 'fab-position',
});
public expanded = model<boolean>(true);`;

    public apiTypes: string = `// Types
import {
    ToolbarType,
    ToolbarColor,
    ToolbarOrientation,
    ToolbarAlignment,
    ToolbarScrollAction,
    ToolbarRegion,
} from '@almoamendev/ngx-md3';

type ToolbarType = 'floating' | 'docked';
type ToolbarColor = 'standard' | 'vibrant';
type ToolbarOrientation = 'horizontal' | 'vertical';
type ToolbarAlignment = 'start' | 'center' | 'end';
type ToolbarScrollAction = 'none' | 'hide' | 'collapse';
type ToolbarRegion = 'blockStart' | 'blockEnd' | 'inlineStart' | 'inlineEnd';`;

    public apiUsage: string = `<!-- A floating toolbar over the content, in the scaffold's bottom bar region -->

<md3-toolbar md3-scaffold-bar="bottom" toolbar-type="floating" scroll-action="collapse">
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>format_bold</md3-icon>
    </button>
    <button md3-icon-button button-type="standard" md3-toolbar-persistent>
        <md3-icon md3-icon-element>format_italic</md3-icon>
    </button>
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>link</md3-icon>
    </button>
</md3-toolbar>

<!-- With a FAB. The FAB sits beside the container, and it is always kept on collapse. -->
<md3-toolbar md3-scaffold-bar="bottom" fab-position="end" scroll-action="collapse">
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>share</md3-icon>
    </button>
    <button md3-fab button-type="primary">
        <md3-icon md3-icon-element>edit</md3-icon>
    </button>
</md3-toolbar>

<!-- Vertical, in a rail region. It reserves its own space, so nothing goes behind it. -->
<md3-toolbar md3-scaffold-rail="trailing" toolbar-color="vibrant">
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>zoom_in</md3-icon>
    </button>
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>zoom_out</md3-icon>
    </button>
</md3-toolbar>

<!-- Docked: fills the region, square corners, no elevation. -->
<md3-toolbar md3-scaffold-bar="bottom" toolbar-type="docked" alignment="start">
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>undo</md3-icon>
    </button>
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>redo</md3-icon>
    </button>
</md3-toolbar>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ToolbarConfig, {
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
        const config = this.configSheet?.componentInstance;

        if (!config) {
            return;
        }

        config.toolbarType.setValue(this.toolbarType());
        config.toolbarType.registerOnChange(() => {
            this.toolbarType.set(config.toolbarType.value);
        });

        config.toolbarColor.setValue(this.toolbarColor());
        config.toolbarColor.registerOnChange(() => {
            this.toolbarColor.set(config.toolbarColor.value);
        });

        config.orientation.setValue(this.orientationChoice());
        config.orientation.registerOnChange(() => {
            this.orientationChoice.set(config.orientation.value);
        });

        config.alignment.setValue(this.alignment());
        config.alignment.registerOnChange(() => {
            this.alignment.set(config.alignment.value);
        });

        config.scrollAction.setValue(this.scrollAction());
        config.scrollAction.registerOnChange(() => {
            this.scrollAction.set(config.scrollAction.value);
        });

        config.fabPosition.setValue(this.fabPosition());
        config.fabPosition.registerOnChange(() => {
            this.fabPosition.set(config.fabPosition.value);
        });

        config.showFab.setValue(this.showFab());
        config.showFab.registerOnChange(() => {
            this.showFab.set(config.showFab.value);
        });

        config.persistentItem.setValue(this.persistentItem());
        config.persistentItem.registerOnChange(() => {
            this.persistentItem.set(config.persistentItem.value);
        });
    }
}
