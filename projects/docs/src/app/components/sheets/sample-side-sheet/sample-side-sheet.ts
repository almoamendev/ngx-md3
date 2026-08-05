import { Component, inject, input } from '@angular/core';
import {
    Button,
    IconButton,
    IconElement,
    MaterialIcon,
    SIDE_SHEET_CONFIG,
    SideSheetActions,
    SideSheetBody,
    SideSheetConfig,
    SideSheetHeader,
    SideSheetRef,
    TypeBody,
} from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-sample-side-sheet',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        SideSheetActions,
        IconButton,
        IconElement,
        MaterialIcon,
        Button,
        TypeBody,
    ],
    templateUrl: './sample-side-sheet.html',
})
export class SampleSideSheet {
    public title = input<string>('Side sheet');

    /** The configuration this sheet was opened with, shown in the body. */
    protected readonly config = inject<SideSheetConfig>(SIDE_SHEET_CONFIG, { optional: true }) ?? {};

    constructor(
        private readonly sheetRef: SideSheetRef<SampleSideSheet, boolean>
    ) {
    }

    public close(result: boolean = false): void {
        this.sheetRef.close(result);
    }
}
