import { Component } from '@angular/core';
import { Button, ButtonGroupModule, SheetsService } from '@vip9008/ngx-md3';
import { ButtonGroupConfig } from './button-group-config/button-group-config';

@Component({
    selector: 'app-button-groups',
    imports: [
        Button,
        ButtonGroupModule,
    ],
    templateUrl: './button-groups.component.html',
    styleUrl: './button-groups.component.scss',
})
export class ButtonGroupsComponent {
    constructor(
        private sheetsService: SheetsService,
    ) {
    }
    
    public openConfig(): void {
        const ref = this.sheetsService.openSideSheet(ButtonGroupConfig, {
            // data: { title: 'First sheet' },
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });

        ref.afterClosed().subscribe((_) => {
        });
    }
}
