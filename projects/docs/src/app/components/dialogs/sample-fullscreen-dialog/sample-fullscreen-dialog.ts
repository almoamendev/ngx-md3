import { Component, inject, input } from '@angular/core';
import {
    Button,
    DIALOG_CONFIG,
    DialogBody,
    DialogConfig,
    DialogRef,
    DialogService,
    FullScreenDialogHeader,
    IconButton,
    IconElement,
    MaterialIcon,
    SheetsService,
    SideSheetBody,
    SideSheetHeader,
    SideSheetRef,
    TypeBody,
    TypeTitle,
} from '@almoamendev/ngx-md3';
import { SampleDialog } from '../sample-dialog/sample-dialog';

/** Side sheet opened from the full screen dialog, to show where it lands. */
@Component({
    selector: 'app-sample-fullscreen-sheet',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        IconElement,
        MaterialIcon,
        TypeBody,
    ],
    template: `
        <md3-side-sheet-header title="Details">
            <button type="button" md3-icon-button trailing button-type="standard" (click)="close()">
                <md3-icon md3-icon-element>close</md3-icon>
            </button>
        </md3-side-sheet-header>
        <md3-side-sheet-body>
            <p md3-type-body size="medium" style="margin: 0 1.5em;">
                This side sheet opened inside the full screen dialog, in the same
                start and end panes the scaffold uses.
            </p>
        </md3-side-sheet-body>
    `,
})
export class SampleFullScreenSheet {
    private readonly sheetRef = inject<SideSheetRef>(SideSheetRef);

    public close(): void {
        this.sheetRef.close();
    }
}

@Component({
    selector: 'app-sample-fullscreen-dialog',
    imports: [
        FullScreenDialogHeader,
        DialogBody,
        Button,
        IconButton,
        IconElement,
        MaterialIcon,
        TypeBody,
        TypeTitle,
    ],
    templateUrl: './sample-fullscreen-dialog.html',
})
export class SampleFullScreenDialog {
    public showIcon = input<boolean>(true);

    private readonly dialogService = inject(DialogService);
    private readonly sheets = inject(SheetsService);
    private readonly config = inject<DialogConfig<Record<string, unknown>>>(DIALOG_CONFIG, { optional: true }) ?? {};

    constructor(
        private readonly dialogRef: DialogRef<SampleFullScreenDialog, boolean>
    ) {
    }

    /** Lands in the dialog's own pane, not behind it. */
    public openSideSheet(): void {
        this.sheets.openSideSheet(SampleFullScreenSheet, {
            side: 'end',
            type: 'default',
            closeExisting: true,
        });
    }

    /** Opens on top of the full screen dialog, which stays where it is. */
    public openDialog(): void {
        this.dialogService.open(SampleDialog, {
            ...this.config,
            data: {
                showIcon: this.showIcon(),
                level: 1,
            },
        });
    }

    /** Goes out of sight with the whole task it holds still in place. */
    public hide(): void {
        this.dialogRef.hide();
    }

    public close(result: boolean = false): void {
        this.dialogRef.close(result);
    }
}
