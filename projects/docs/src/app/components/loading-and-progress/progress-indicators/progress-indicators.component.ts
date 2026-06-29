import { Component, effect, OnDestroy, signal } from '@angular/core';
import { CircularProgressIndicator, IconButton, IconElement, LinearProgressIndicator, MaterialIcon, SheetsService, SideSheetRef, TypeBody } from "@vip9008/ngx-md3";
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { ProgressConfig } from './progress-config/progress-config';

@Component({
    selector: 'app-progress-indicators',
    imports: [
        CircularProgressIndicator,
        LinearProgressIndicator,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './progress-indicators.component.html',
    styleUrl: './progress-indicators.component.scss',
})
export class ProgressIndicatorsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ProgressConfig> | undefined;
    public configOpen = signal(false);

    public indeterminate = signal<boolean>(false);
    public thickness = signal<4 | 8>(4);
    public progress = signal<number>(0);

    public apiImport: string = `// Component imports
import {
    CircularProgressIndicator, // circular
    LinearProgressIndicator, // linear
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public indeterminate = input<boolean>(false);
public thickness = input<4 | 8>(4);
public progress = input<number>(0);`;

    public apiUsage: string = `<!-- Component usage -->

<!-- circular progress indicator -->
<md3-circular-progress-indicator [indeterminate]="false" [thickness]="4" [progress]="0"></md3-circular-progress-indicator>

<!-- linear progress indicator -->
<md3-linear-progress-indicator [indeterminate]="false" [thickness]="4" [progress]="0"></md3-linear-progress-indicator>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
        effect(() => {
            if (this.indeterminate()) {
                this.configSheet?.componentInstance?.progress.disable();
            } else {
                this.configSheet?.componentInstance?.progress.enable();
            }
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ProgressConfig, {
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
        this.configSheet?.componentInstance?.indeterminate.setValue(this.indeterminate());
        this.configSheet?.componentInstance?.indeterminate.registerOnChange(() => {
            this.indeterminate.set(this.configSheet?.componentInstance?.indeterminate.value);
        });

        // this.configSheet?.componentInstance?.thickness.setValue(this.thickness());
        this.configSheet?.componentInstance?.thickness.registerOnChange(() => {
            this.thickness.set(this.configSheet?.componentInstance?.thickness.value);
        });

        this.configSheet?.componentInstance?.progress.setValue(this.progress());
        this.configSheet?.componentInstance?.progress.registerOnChange(() => {
            this.progress.set(this.configSheet?.componentInstance?.progress.value);
        });
    }
}
