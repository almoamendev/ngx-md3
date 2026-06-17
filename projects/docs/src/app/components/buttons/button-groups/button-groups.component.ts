import { Component, OnDestroy, signal } from '@angular/core';
import { Button, ButtonGroupModule, ButtonGroupSelection, ButtonGroupType, ButtonSize, Card, SheetsService, SideSheetRef } from '@vip9008/ngx-md3';
import { ButtonGroupConfig } from './button-group-config/button-group-config';
import { Playground } from '../../playground/playground';

@Component({
    selector: 'app-button-groups',
    imports: [
        Button,
        ButtonGroupModule,
        Card,
        Playground,
    ],
    templateUrl: './button-groups.component.html',
    styleUrl: './button-groups.component.scss',
})
export class ButtonGroupsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ButtonGroupConfig> | undefined;
    public configOpen = signal(false);

    public buttonSize = signal<ButtonSize>('small');
    public groupType = signal<ButtonGroupType>('standard');
    public selection = signal<ButtonGroupSelection>('none');

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ButtonGroupConfig, {
            // data: { title: 'First sheet' },
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });
        this.configOpen.set(true);

        this.registerConfigEvents();

        this.configSheet.afterClosed().subscribe((_) => {
            this.configSheet = undefined;
            this.configOpen.set(false);
        });
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
    }

    private registerConfigEvents() {
        this.configSheet?.componentInstance?.buttonSize.setValue(this.buttonSize());
        this.configSheet?.componentInstance?.buttonSize.registerOnChange(() => {
            this.buttonSize.set(this.configSheet?.componentInstance?.buttonSize.value);
        });

        this.configSheet?.componentInstance?.isConntected.setValue(this.groupType() == 'connected');
        this.configSheet?.componentInstance?.isConntected.registerOnChange(() => {
            this.groupType.set(this.configSheet?.componentInstance?.isConntected.value ? 'connected' : 'standard');
        });

        this.configSheet?.componentInstance?.selectionType.setValue(this.selection());
        this.configSheet?.componentInstance?.selectionType.registerOnChange(() => {
            this.selection.set(this.configSheet?.componentInstance?.selectionType.value);
        });
    }
}
