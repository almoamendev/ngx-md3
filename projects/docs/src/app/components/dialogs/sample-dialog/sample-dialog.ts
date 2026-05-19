import { Component } from '@angular/core';
import { Button, DialogActions, DialogBody, DialogHeader, IconElement, MaterialIcon } from '@vip9008/ngx-md3';

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
}
