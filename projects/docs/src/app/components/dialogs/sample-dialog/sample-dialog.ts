import { Component } from '@angular/core';
import { DialogHeader, IconElement, MaterialIcon, TypeHeadline } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-sample-dialog',
    imports: [
        DialogHeader,
        IconElement,
        MaterialIcon,
        TypeHeadline,
    ],
    templateUrl: './sample-dialog.html',
    styleUrl: './sample-dialog.scss',
})
export class SampleDialog {
}
