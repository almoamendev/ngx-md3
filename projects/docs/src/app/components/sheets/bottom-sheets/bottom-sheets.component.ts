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
    BottomSheetHeader, // optional
    BottomSheetBody, // optional
    BottomSheetActions, // optional
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
     * Insets the sheet from the viewport edges and rounds every corner.
     * @default false
     */
    inset?: boolean;

    /**
     * Shows the MD3 drag handle centered above the sheet's content.
     * @default true
     */
    handle?: boolean;

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

    public apiUsage: string = `<!-- Component usage -->

<!-- optional sheet header, with an optional leading or trailing icon button -->
<md3-bottom-sheet-header title="Details">
    <button type="button" md3-icon-button trailing button-type="standard" (click)="close()">
        <md3-icon md3-icon-element>close</md3-icon>
    </button>
</md3-bottom-sheet-header>

<!-- optional body section, scrolls on its own -->
<md3-bottom-sheet-body>...</md3-bottom-sheet-body>

<!-- optional actions pinned to the bottom of the sheet -->
<md3-bottom-sheet-actions>
    <button type="button" md3-button button-type="filled">Save</button>
    <button type="button" md3-button button-type="text">Cancel</button>
</md3-bottom-sheet-actions>`;

    constructor(
        private bottomSheetService: BottomSheetService
    ) {}

    public openDefaultSheet(): void {
        this.openSheet({});
    }

    public openInsetSheet(): void {
        this.openSheet({ inset: true });
    }

    public openNoHandleSheet(): void {
        this.openSheet({ handle: false });
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
        if (config.inset) {
            return 'Inset sheet';
        }

        if (config.handle === false) {
            return 'No handle';
        }

        return 'Bottom sheet';
    }
}
