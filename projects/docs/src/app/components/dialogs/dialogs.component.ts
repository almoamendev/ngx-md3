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

    public sampleDialog(showIcon: boolean = true) {
        const ref = this.dialogService.open(SampleDialog, {
            data: {
                showIcon: showIcon,
            },
            bindDataToInputs: true,
            ariaLabel: 'Sample Dialog',
        });

        ref.afterClosed().subscribe((result) => {
            console.log("Dialog closed, results:: ", result);
        });
    }
}
