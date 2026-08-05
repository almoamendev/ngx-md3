import { Component, inject, input } from '@angular/core';
import { Button, DIALOG_CONFIG, DialogActions, DialogBody, DialogConfig, DialogHeader, DialogRef, DialogService, IconElement, MaterialIcon } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-sample-dialog',
    imports: [
        DialogHeader,
        IconElement,
        MaterialIcon,
        DialogBody,
        DialogActions,
        Button,
    ],
    templateUrl: './sample-dialog.html',
    styleUrl: './sample-dialog.scss',
})
export class SampleDialog {
    public showIcon = input<boolean>(true);
    public level = input<number>(1);

    private readonly dialogService = inject(DialogService);

    /**
     * The configuration of this dialog, reused so the dialog opened from here
     * keeps the same scheme, direction and stacking behaviour.
     */
    private readonly config = inject<DialogConfig<Record<string, unknown>>>(DIALOG_CONFIG, { optional: true }) ?? {};

    constructor(
        private readonly dialogRef: DialogRef<SampleDialog, boolean>
    ) {
    }

    public openAnother(): void {
        this.dialogService.open(SampleDialog, {
            ...this.config,
            data: {
                ...this.config.data,
                showIcon: this.showIcon(),
                level: this.level() + 1,
            },
        });
    }

    public closeDialog(result: boolean = false) {
        this.dialogRef.close(result);
    }
}
