import { Component, OnDestroy, signal } from '@angular/core';
import { Button, DialogService, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { SampleDialog } from './sample-dialog/sample-dialog';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { DialogConfig } from './dialog-config/dialog-config';

@Component({
    selector: 'app-dialogs',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './dialogs.component.html',
    styleUrl: './dialogs.component.scss',
})
export class DialogsComponent implements OnDestroy {
    private configSheet: SideSheetRef<DialogConfig> | undefined;
    public configOpen = signal(false);

    public showIcon = signal<boolean>(true);
    public closeEvents = signal<boolean>(true);
    public darkMode = signal<boolean>(true);
    public direction = signal<'ltr' | 'rtl'>('ltr');
    
    constructor(
        private sheetsService: SheetsService,
        private dialogService: DialogService
    ) {}

    public sampleDialog() {
        const ref = this.dialogService.open(SampleDialog, {
            data: {
                showIcon: this.showIcon(),
            },
            bindDataToInputs: true,
            disableCloseEvents: !this.closeEvents(),
            ariaLabel: 'Sample Dialog',
            scheme: this.darkMode() ? 'dark' : 'light',
            direction: this.direction(),
        });

        ref.afterClosed().subscribe((result) => {
            console.log("Dialog closed, results:: ", result);
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(DialogConfig, {
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
        this.configSheet?.componentInstance?.showIcon.setValue(this.showIcon());
        this.configSheet?.componentInstance?.showIcon.registerOnChange(() => {
            this.showIcon.set(this.configSheet?.componentInstance?.showIcon.value);
        });

        this.configSheet?.componentInstance?.closeEvents.setValue(this.closeEvents());
        this.configSheet?.componentInstance?.closeEvents.registerOnChange(() => {
            this.closeEvents.set(this.configSheet?.componentInstance?.closeEvents.value);
        });

        this.configSheet?.componentInstance?.darkMode.setValue(this.darkMode());
        this.configSheet?.componentInstance?.darkMode.registerOnChange(() => {
            this.darkMode.set(this.configSheet?.componentInstance?.darkMode.value);
        });

        this.configSheet?.componentInstance?.direction.setValue(this.direction());
        this.configSheet?.componentInstance?.direction.registerOnChange(() => {
            this.direction.set(this.configSheet?.componentInstance?.direction.value);
        });
    }
}
