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
        // this.configSheet?.componentInstance?.buttonSize.setValue(this.buttonSize());
        // this.configSheet?.componentInstance?.buttonSize.registerOnChange(() => {
        //     this.buttonSize.set(this.configSheet?.componentInstance?.buttonSize.value);
        // });

        // this.configSheet?.componentInstance?.buttonType.setValue(this.buttonType());
        // this.configSheet?.componentInstance?.buttonType.registerOnChange(() => {
        //     this.buttonType.set(this.configSheet?.componentInstance?.buttonType.value);
        // });

        // this.configSheet?.componentInstance?.buttonWidth.setValue(this.buttonWidth());
        // this.configSheet?.componentInstance?.buttonWidth.registerOnChange(() => {
        //     this.buttonWidth.set(this.configSheet?.componentInstance?.buttonWidth.value);
        // });

        // this.configSheet?.componentInstance?.isSquared.setValue(this.isSquared());
        // this.configSheet?.componentInstance?.isSquared.registerOnChange(() => {
        //     this.isSquared.set(this.configSheet?.componentInstance?.isSquared.value);
        // });

        // this.configSheet?.componentInstance?.isSelected.setValue(this.isSelected() === null ? 'none' : 'toggle');
        // this.configSheet?.componentInstance?.isSelected.registerOnChange(() => {
        //     const selection = this.configSheet?.componentInstance?.isSelected.value;
        //     this.isSelected.set(selection == 'none' ? null : false);
        // });
    }
}

