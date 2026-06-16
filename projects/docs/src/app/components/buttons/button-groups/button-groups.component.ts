import { Component, OnDestroy } from '@angular/core';
import { Button, ButtonGroupModule, SheetsService, SideSheetRef } from '@vip9008/ngx-md3';
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
export class ButtonGroupsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ButtonGroupConfig> | undefined;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }
    
    public openConfig(): void {
        this.configSheet = this.sheetsService.openSideSheet(ButtonGroupConfig, {
            // data: { title: 'First sheet' },
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });

        // this.configSheet.afterClosed().subscribe((_) => {
        // });
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
    }
}
