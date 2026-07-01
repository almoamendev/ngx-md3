import { Component, OnDestroy, signal } from '@angular/core';
import { ChipAvatar, Chips, ChipType, IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, TextFieldModule, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { ChipsConfig } from './chips-config/chips-config';

@Component({
    selector: 'app-chips',
    imports: [
        Chips,
        ChipAvatar,
        IconElement,
        InputElement,
        MaterialIcon,
        IconButton,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './chips.component.html',
    styleUrl: './chips.component.scss',
})
export class ChipsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ChipsConfig> | undefined;
    public configOpen = signal(false);

    public chipType = signal<ChipType>('assist');
    public hasSurface = signal<boolean>(false);
    public isElevated = signal<boolean>(false);
    public disabled = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Chips,
    ChipAvatar, // optional
    IconElement, // optional
    InputElement, // optional
    MaterialIcon, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs & outputs
public removeFunction = output<void>({
    alias: 'on-remove',
});
public chipType = input<ChipType>('assist', {
    alias: 'chip-type',
});
public hasSurface = input<boolean, unknown>(false, {
    alias: 'surface',
    transform: booleanAttribute,
});
public isElevated = input<boolean, unknown>(false, {
    alias: 'elevated',
    transform: booleanAttribute,
});`;

    public apiTypes: string = `// Types
import { ChipType } from '@vip9008/ngx-md3';

type ChipType = 'assist' | 'filter' | 'input' | 'suggestion';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- md3-chip can be used on <button>, <a>, <label> -->
<button md3-chip>...</button>
<a md3-chip>...</a>
<label md3-chip>...</label>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ChipsConfig, {
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
        this.configSheet?.componentInstance?.chipType.setValue(this.chipType());
        this.configSheet?.componentInstance?.chipType.registerOnChange(() => {
            this.chipType.set(this.configSheet?.componentInstance?.chipType.value);
        });

        this.configSheet?.componentInstance?.hasSurface.setValue(this.hasSurface());
        this.configSheet?.componentInstance?.hasSurface.registerOnChange(() => {
            this.hasSurface.set(this.configSheet?.componentInstance?.hasSurface.value);
        });

        this.configSheet?.componentInstance?.isElevated.setValue(this.isElevated());
        this.configSheet?.componentInstance?.isElevated.registerOnChange(() => {
            this.isElevated.set(this.configSheet?.componentInstance?.isElevated.value);
        });

        this.configSheet?.componentInstance?.disabled.setValue(this.disabled());
        this.configSheet?.componentInstance?.disabled.registerOnChange(() => {
            this.disabled.set(this.configSheet?.componentInstance?.disabled.value);
        });
    }
}

