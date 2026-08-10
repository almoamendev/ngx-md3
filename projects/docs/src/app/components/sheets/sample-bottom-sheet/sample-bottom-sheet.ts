import { Component, inject, input } from '@angular/core';
import {
    BOTTOM_SHEET_CONFIG,
    BottomSheetActions,
    BottomSheetBody,
    BottomSheetConfig,
    BottomSheetHeader,
    BottomSheetRef,
    Button,
    IconButton,
    IconElement,
    MaterialIcon,
    TypeBody,
} from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-sample-bottom-sheet',
    imports: [
        BottomSheetHeader,
        BottomSheetBody,
        BottomSheetActions,
        IconButton,
        IconElement,
        MaterialIcon,
        Button,
        TypeBody,
    ],
    templateUrl: './sample-bottom-sheet.html',
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
