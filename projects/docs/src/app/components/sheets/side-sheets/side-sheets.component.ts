import { Component, OnDestroy } from '@angular/core';
import {
    Button,
    Divider,
    SheetsService,
    SideSheetConfig,
    SideSheetRef,
    SideSheetSide,
    TypeBody,
    TypeDisplay,
} from '@almoamendev/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { SampleSideSheet } from '../sample-side-sheet/sample-side-sheet';

@Component({
    selector: 'app-side-sheets',
    imports: [
        Button,
        Playground,
        Divider,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './side-sheets.component.html',
})
export class SideSheetsComponent implements OnDestroy {
    private sheetRef?: SideSheetRef<SampleSideSheet, boolean>;
    private lastSide: SideSheetSide = 'end';

    public apiImport: string = `// Component imports
import {
    SheetsService,
    SideSheetHeader, // optional
    SideSheetBody, // optional
    SideSheetActions, // optional
    Button, // optional
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// using sheets service

// sheets service
private sheetsService: SheetsService = inject(SheetsService);

// side sheet reference: can be injected inside the sheet component
private sheetRef: SideSheetRef = inject(SideSheetRef<YourSheetComponent, YourSheetResults>);

// open a side sheet
const sheetRef: SideSheetRef = sheetsService.openSideSheet(YourSheetComponent, <SideSheetConfig>{...});

// close it, with an optional result
sheetRef.close(yourSheetResult);

// or close whichever sheet is visible on a side
sheetsService.closeSideSheet('end');

// after close
sheetRef.afterClosed().subscribe((result: YourSheetResults) => {
    // optional: result when closing the sheet
});`;

    public apiTypes: string = `// Types
import { SideSheetConfig, SideSheetRef } from '@almoamendev/ngx-md3';

interface SideSheetConfig<D = unknown> {
    /**
     * Optional data passed to the component opened inside the sheet.
     * The dynamic component can read it by injecting SIDE_SHEET_DATA.
     * @default {}
     */
    data?: D;

    /**
     * When enabled, object keys from data are also assigned to matching inputs
     * on the dynamic component through Angular's setInput API.
     * @default false
     */
    bindDataToInputs?: boolean;

    /**
     * Side of the layout the sheet is anchored to
     * @default end
     */
    side?: 'start' | 'end';

    /**
     * How the sheet sits in the layout. Compact and medium windows
     * always fall back to modal
     * @default default
     */
    type?: 'default' | 'standard' | 'modal';

    /**
     * Insets the sheet from the layout edges and rounds every corner
     * @default false
     */
    inset?: boolean;

    /**
     * Shows a divider between the sheet and the content beside it
     * @default false
     */
    divider?: boolean;

    /**
     * Closes the sheets already open on that side instead of stacking
     * on top of them
     * @default false
     */
    closeExisting?: boolean;

    /**
     * Optional Angular context for the dynamic component.
     */
    viewContainerRef?: ViewContainerRef;

    /**
     * Optional Angular injector used when creating the sheet component.
     */
    injector?: Injector;
}

class SideSheetRef<T = unknown, R = unknown> {
    /**
     * The side the sheet was opened on
     */
    public readonly side: SideSheetSide;

    /**
     * Filled by SheetsService after the sheet component is attached
     */
    public componentInstance?: T;

    /**
     * Change the configuration of an open sheet
     */
    public setSide(side: SideSheetSide): void;
    public setSheetType(type: SideSheetType): void;
    public setInset(isInset: boolean): void;
    public setDivider(showDivider: boolean): void;

    /**
     * Hide the sheet without destroying it, then bring it back.
     * Handled automatically when sheets stack on the same side
     */
    public hide(): void;
    public show(): void;

    /**
     * Close the sheet with an optional result, or drop it without
     * playing the closing animation
     */
    public close(result?: R): void;
    public dispose(result?: R): void;

    /**
     * After close observable. optional result will emit after the sheet is closed
     */
    public afterClosed(): Observable<R | undefined>;
}`;

    public apiUsage: string = `<!-- Component usage -->

<!-- optional sheet header, with an optional leading or trailing icon button -->
<md3-side-sheet-header title="Details">
    <button type="button" md3-icon-button trailing button-type="standard" (click)="close()">
        <md3-icon md3-icon-element>close</md3-icon>
    </button>
</md3-side-sheet-header>

<!-- optional body section, scrolls on its own -->
<md3-side-sheet-body>...</md3-side-sheet-body>

<!-- optional actions pinned to the bottom of the sheet -->
<md3-side-sheet-actions>
    <button type="button" md3-button button-type="filled">Save</button>
    <button type="button" md3-button button-type="text">Cancel</button>
</md3-side-sheet-actions>`;

    public apiOutlets: string = `<!-- Side sheets need an outlet to render in -->

<md3-scaffold>
    <md3-app-bar md3-scaffold-bar="top">...</md3-app-bar>

    <!-- the scaffold registers a start and an end outlet -->
    <div md3-scaffold-pane="main">
        <router-outlet></router-outlet>
    </div>
</md3-scaffold>`;

    constructor(
        private sheetsService: SheetsService
    ) {}

    public openEndSheet(): void {
        this.openSheet({ side: 'end', type: 'default' });
    }

    public openStartSheet(): void {
        this.openSheet({ side: 'start', type: 'default' });
    }

    public openStandardSheet(): void {
        this.openSheet({ side: 'end', type: 'standard', divider: true });
    }

    public openModalSheet(): void {
        this.openSheet({ side: 'end', type: 'modal' });
    }

    public openInsetSheet(): void {
        this.openSheet({ side: 'end', type: 'default', inset: true });
    }

    public closeSheet(): void {
        this.sheetsService.closeSideSheet(this.lastSide);
    }

    ngOnDestroy(): void {
        this.sheetRef?.close();
    }

    private openSheet(config: SideSheetConfig): void {
        this.lastSide = config.side ?? 'end';

        this.sheetRef = this.sheetsService.openSideSheet(SampleSideSheet, {
            ...config,
            data: {
                title: this.sheetTitle(config),
            },
            bindDataToInputs: true,
            closeExisting: true,
        });
    }

    private sheetTitle(config: SideSheetConfig): string {
        const type = config.type ?? 'default';

        return type.charAt(0).toUpperCase() + type.slice(1) + ' sheet';
    }
}
