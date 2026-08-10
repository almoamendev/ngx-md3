import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
    BottomSheetConfig,
    BottomSheetRef,
    BottomSheetService,
    Button,
    Divider,
    TypeBody,
    TypeDisplay,
} from '@almoamendev/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { SampleBottomSheet } from '../sample-bottom-sheet/sample-bottom-sheet';

@Component({
    selector: 'app-bottom-sheets',
    imports: [
        Button,
        Playground,
        Divider,
        RouterLink,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './bottom-sheets.component.html',
})
export class BottomSheetsComponent implements OnDestroy {
    private sheetRef?: BottomSheetRef<SampleBottomSheet, boolean>;
    private standardSheetRef?: BottomSheetRef<SampleBottomSheet, boolean>;

    public apiImport: string = `// Component imports
import {
    BottomSheetService,
    Button, // optional
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// using the bottom sheet service

// bottom sheet service
private bottomSheetService: BottomSheetService = inject(BottomSheetService);

// bottom sheet reference: can be injected inside the sheet component
private sheetRef: BottomSheetRef = inject(BottomSheetRef<YourSheetComponent, YourSheetResults>);

// open a bottom sheet, replacing the one of the same type that is open, if there is one
const sheetRef: BottomSheetRef = bottomSheetService.open(YourSheetComponent, <BottomSheetConfig>{...});

// a standard sheet docks into the scaffold and shares the layout with the page
const standardRef: BottomSheetRef = bottomSheetService.open(YourSheetComponent, <BottomSheetConfig>{
    type: 'standard',
    label: 'Nearby places',
});

// standard sheets move between their two heights
standardRef.expand();
standardRef.collapse();
standardRef.toggle();
standardRef.state(); // 'collapsed' | 'expanded'

// close it, with an optional result
sheetRef.close(yourSheetResult);

// or close whichever bottom sheet is open, the modal one first
bottomSheetService.close();

// after close
sheetRef.afterClosed().subscribe((result: YourSheetResults) => {
    // optional: result when closing the sheet
});`;

    public apiTypes: string = `// Types
import { BottomSheetConfig, BottomSheetRef } from '@almoamendev/ngx-md3';

interface BottomSheetConfig<D = unknown> {
    /**
     * Optional data passed to the component opened inside the sheet.
     * The dynamic component can read it by injecting BOTTOM_SHEET_DATA.
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
     * How the sheet sits in the layout. A modal sheet floats above the page
     * with a scrim; a standard sheet docks into the scaffold.
     * @default 'modal'
     */
    type?: 'standard' | 'modal';

    /**
     * Shows the MD3 drag handle centered above the sheet's content.
     * @default true
     */
    handle?: boolean;

    /**
     * Lets the sheet be dragged, and flung. A modal sheet is dragged down to
     * dismiss it, a standard sheet between its two heights.
     * @default true
     */
    gestures?: boolean;

    /**
     * Standard only. How much of the sheet shows when it is collapsed.
     * Numbers are pixels.
     * @default '10em'
     */
    collapsedHeight?: number | string;

    /**
     * Standard only. Height the sheet grows to when it is expanded.
     * @default '70dvh'
     */
    expandedHeight?: number | string;

    /**
     * Standard only. Which of the two heights the sheet opens at.
     * @default 'collapsed'
     */
    initialState?: 'collapsed' | 'expanded';

    /**
     * Standard only. Whether dragging below the collapsed height closes it.
     * @default false
     */
    dismissible?: boolean;

    /**
     * Standard only. Accessible name for the region the sheet occupies.
     */
    label?: string;

    /**
     * Standard only. Id of the element naming the sheet, when it already has
     * a visible title.
     */
    labelledBy?: string;

    /**
     * Overrides the color scheme of the sheet regardless of the page it opened from.
     * @default inherit
     */
    scheme?: 'inherit' | 'dark' | 'light';

    /**
     * Overrides the text direction of the sheet.
     */
    direction?: null | 'ltr' | 'rtl';

    /**
     * Optional Angular context for the dynamic component.
     */
    viewContainerRef?: ViewContainerRef;

    /**
     * Optional Angular injector used when creating the sheet component.
     */
    injector?: Injector;
}

class BottomSheetRef<T = unknown, R = unknown> {
    /**
     * Filled by BottomSheetService after the sheet component is attached
     */
    public componentInstance?: T;

    /**
     * Close the sheet with an optional result
     */
    public close(result?: R): Promise<void>;

    /**
     * After close observable. optional result will emit after the sheet is closed
     */
    public afterClosed(): Observable<R | undefined>;

    /**
     * Height the sheet is resting at. A modal sheet is only ever fully open
     */
    public get state(): Signal<'collapsed' | 'expanded'>;

    /**
     * Move a standard sheet between its two heights. No-ops on a modal sheet
     */
    public expand(): void;
    public collapse(): void;
    public toggle(): void;

    /**
     * Resize a standard sheet while it is open
     */
    public setCollapsedHeight(height: number | string): void;
    public setExpandedHeight(height: number | string): void;
    public setDismissible(value: boolean): void;
}`;

    public apiUsage: string = `<!-- Component usage: the sheet lays its content out on a
     "header" / "body" / "actions" grid, so each section only claims its area -->

<header style="grid-area: header;">
    <h2 md3-type-title size="large">Details</h2>
    <button type="button" md3-icon-button button-type="standard" (click)="close()">
        <md3-icon md3-icon-element>close</md3-icon>
    </button>
</header>

<!-- the body is the part that scrolls -->
<div style="grid-area: body; overflow-y: auto;" class="md3-scrollable">...</div>

<div style="grid-area: actions;">
    <button type="button" md3-button button-type="filled">Save</button>
    <button type="button" md3-button button-type="text">Cancel</button>
</div>`;

    constructor(
        private bottomSheetService: BottomSheetService
    ) {}

    public openDefaultSheet(): void {
        this.openSheet({});
    }

    public openNoHandleSheet(): void {
        this.openSheet({ handle: false });
    }

    public openNoGesturesSheet(): void {
        this.openSheet({ gestures: false });
    }

    public openStandardSheet(): void {
        this.openStandard({});
    }

    public openDismissibleStandardSheet(): void {
        this.openStandard({ dismissible: true });
    }

    public expandStandardSheet(): void {
        this.standardSheetRef?.expand();
    }

    public collapseStandardSheet(): void {
        this.standardSheetRef?.collapse();
    }

    public closeStandardSheet(): void {
        this.standardSheetRef?.close();
    }

    public closeSheet(): void {
        this.bottomSheetService.close();
    }

    ngOnDestroy(): void {
        this.sheetRef?.close();
        this.standardSheetRef?.close();
    }

    private openSheet(config: BottomSheetConfig): void {
        this.sheetRef = this.bottomSheetService.open(SampleBottomSheet, {
            ...config,
            data: {
                title: this.sheetTitle(config),
            },
            bindDataToInputs: true,
        });
    }

    private openStandard(config: BottomSheetConfig): void {
        this.standardSheetRef = this.bottomSheetService.open(SampleBottomSheet, {
            ...config,
            type: 'standard',
            label: 'Sample bottom sheet',
            data: {
                title: config.dismissible ? 'Dismissible sheet' : 'Standard sheet',
            },
            bindDataToInputs: true,
        });
    }

    private sheetTitle(config: BottomSheetConfig): string {
        if (config.handle === false) {
            return 'No handle';
        }

        if (config.gestures === false) {
            return 'No gestures';
        }

        return 'Bottom sheet';
    }
}
