import { Component, OnDestroy } from '@angular/core';
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
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './bottom-sheets.component.html',
})
export class BottomSheetsComponent implements OnDestroy {
    private sheetRef?: BottomSheetRef<SampleBottomSheet, boolean>;

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

// open a bottom sheet, replacing the one that is open, if there is one
const sheetRef: BottomSheetRef = bottomSheetService.open(YourSheetComponent, <BottomSheetConfig>{...});

// close it, with an optional result
sheetRef.close(yourSheetResult);

// or close whichever bottom sheet is open
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
     * Shows the MD3 drag handle centered above the sheet's content.
     * @default true
     */
    handle?: boolean;

    /**
     * Lets the sheet be dragged down, and flung, to dismiss it.
     * @default true
     */
    gestures?: boolean;

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

    public closeSheet(): void {
        this.bottomSheetService.close();
    }

    ngOnDestroy(): void {
        this.sheetRef?.close();
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
