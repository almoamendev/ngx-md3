import { Component, input, Input } from '@angular/core';
import { Button, DialogActions, DialogBody, DialogHeader, DialogRef, IconElement, MaterialIcon } from '@almoamendev/ngx-md3';

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

    constructor(
        private readonly dialogRef: DialogRef<SampleDialog, boolean>
    ) {
    }

    public closeDialog(result: boolean = false) {
        this.dialogRef.close(result);
    }
}
