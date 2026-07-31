import { Component, OnDestroy, signal } from '@angular/core';
import { IconButton, IconElement, LoadingIndicator, MaterialIcon, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from "@vip9008/ngx-md3";
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { LoadingConfig } from './loading-config/loading-config';

@Component({
    selector: 'app-loading-indicators',
    imports: [
        LoadingIndicator,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './loading-indicators.component.html',
    styleUrl: './loading-indicators.component.scss',
})
export class LoadingIndicatorsComponent implements OnDestroy {
    private configSheet: SideSheetRef<LoadingConfig> | undefined;
    public configOpen = signal(false);

    public contained = signal<boolean>(false);
    public size = signal<number>(48);

    public apiImport: string = `// Component imports
import {
    LoadingIndicator,
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public contained = input<boolean>(false);
public size = input<number>(48);`;

    public apiUsage: string = `<!-- Component usage -->

<md3-loading-indicator [contained]="true" [size]="48"></md3-loading-indicator>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(LoadingConfig, {
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
        this.configSheet?.componentInstance?.contained.setValue(this.contained());
        this.configSheet?.componentInstance?.contained.registerOnChange(() => {
            this.contained.set(this.configSheet?.componentInstance?.contained.value);
        });

        this.configSheet?.componentInstance?.size.setValue(this.size());
        this.configSheet?.componentInstance?.size.registerOnChange(() => {
            this.size.set(this.configSheet?.componentInstance?.size.value);
        });
    }
}
