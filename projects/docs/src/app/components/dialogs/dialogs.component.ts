import { Component } from '@angular/core';
import { Button, DialogService } from '@vip9008/ngx-md3';
import { SampleDialog } from './sample-dialog/sample-dialog';

@Component({
    selector: 'app-dialogs.component',
    imports: [
        Button
    ],
    templateUrl: './dialogs.component.html',
    styleUrl: './dialogs.component.scss',
})
export class DialogsComponent {
    constructor(
        private dialogService: DialogService
    ) {}

    public sampleDialog() {
        const ref = this.dialogService.open(SampleDialog, {
            data: {
                input1: "Input 1",
                input2: "Input 2",
                input3: "Input 3",
            },
            ariaLabel: 'Sample Dialog',
        });

        ref.afterClosed().subscribe((result) => {
            console.log("Dialog closed, results:: ", result);
        });
    }
}
