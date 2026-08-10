import { Component, inject, input } from '@angular/core';
import {
    BOTTOM_SHEET_CONFIG,
    BottomSheetConfig,
    BottomSheetRef,
    Button,
    IconButton,
    IconElement,
    MaterialIcon,
    TypeBody,
    TypeTitle,
} from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-sample-bottom-sheet',
    imports: [
        IconButton,
        IconElement,
        MaterialIcon,
        Button,
        TypeBody,
        TypeTitle,
    ],
    templateUrl: './sample-bottom-sheet.html',
    styleUrl: './sample-bottom-sheet.scss',
})
export class SampleBottomSheet {
    public title = input<string>('Bottom sheet');

    /** The configuration this sheet was opened with, shown in the body. */
    protected readonly config = inject<BottomSheetConfig>(BOTTOM_SHEET_CONFIG, { optional: true }) ?? {};

    constructor(
        private readonly sheetRef: BottomSheetRef<SampleBottomSheet, boolean>
    ) {
    }

    public close(result: boolean = false): void {
        this.sheetRef.close(result);
    }
}
