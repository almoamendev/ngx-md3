import { Component, effect, OnDestroy, signal } from '@angular/core';
import { ChipAvatar, Chips, ChipStyle, ChipType, IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, TextFieldModule, TypeBody } from '@vip9008/ngx-md3';
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
    public chipStyle = signal<ChipStyle>('default');
    public disabled = signal<boolean>(false);
    public leadingIcon = signal<boolean>(false);
    public trailingIcon = signal<boolean>(false);
    public avatar = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Chips,
    ChipAvatar, // optional
    IconElement, // optional
    InputElement, // optional
    MaterialIcon, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs & outputs
public trailingFunction = output<void>({
    alias: 'on-trailing',
});
public chipType = input<ChipType>('assist', {
    alias: 'chip-type',
});
public chipStyle = input<ChipStyle>('default', {
    alias: 'chip-style',
});`;

    public apiTypes: string = `// Types
import { ChipType, ChipStyle } from '@vip9008/ngx-md3';

type ChipType = 'assist' | 'filter' | 'input' | 'suggestion';
type ChipStyle = 'default' | 'surface' | 'elevated';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- md3-chip can be used on <button>, <a>, <label> -->
<button md3-chip>...</button>
<a md3-chip>...</a>
<label md3-chip>...</label>

<!-- assist chips -->
<button md3-chip chip-type="assist" chip-style="default">
    <!-- optional icon -->
    <md3-icon md3-icon-element="leading">local_taxi</md3-icon>
    <span>Assist chip</span>
</button>
<button md3-chip chip-type="assist" chip-style="default">
    <!-- custom icon: 18dp -->
    <your-custom-icon-element md3-icon-element="leading"></your-custom-icon-element>
    <span>Assist chip</span>
</button>

<!-- filter chips -->
<label md3-chip chip-type="filter" chip-style="default" on-trailing="trailingFun()">
    <!-- checkbox or radio input to control selection -->
    <input type="checkbox" md3-input-element>
    <span>Filter chip</span>
    <!-- optional -->
    <md3-icon md3-icon-element="trailing">arrow_drop_down</md3-icon>
</label>
<label md3-chip chip-type="filter" chip-style="default" on-trailing="trailingFun()">
    <!-- checkbox or radio input to control selection -->
    <input type="checkbox" md3-input-element>
    <span>Filter chip</span>
    <!-- custom icon: 18dp -->
    <your-custom-icon-element md3-icon-element="trailing"></your-custom-icon-element>
</label>

<!-- input chips -->
<button md3-chip chip-type="input" chip-style="default" on-trailing="trailingFun()">
    <!-- optional icon or avatar -->
    <md3-icon md3-icon-element="leading">image</md3-icon>
    <!-- avatar size: 24dp -->
    <your-avatar-element md3-chip-avatar>person</your-avatar-element>
    <span>Input chip</span>
    <!-- optional trailing icon. default to x -->
    <md3-icon md3-icon-element="trailing">close</md3-icon>
</button>

<!-- suggestion chips -->
<button md3-chip chip-type="suggestion" chip-style="default">
    <span>Suggestion chip</span>
</button>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
        effect(() => {
            this.filterIcons();
        });

        effect(() => {
            if (this.leadingIcon()) {
                this.configSheet?.componentInstance?.avatar.setValue(false);
            }
        });
        
        effect(() => {
            if (this.avatar()) {
                this.configSheet?.componentInstance?.leadingIcon.setValue(false);
            }
        });
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

        this.configSheet?.componentInstance?.chipStyle.setValue(this.chipStyle());
        this.configSheet?.componentInstance?.chipStyle.registerOnChange(() => {
            this.chipStyle.set(this.configSheet?.componentInstance?.chipStyle.value);
        });

        this.configSheet?.componentInstance?.disabled.setValue(this.disabled());
        this.configSheet?.componentInstance?.disabled.registerOnChange(() => {
            this.disabled.set(this.configSheet?.componentInstance?.disabled.value);
        });

        this.configSheet?.componentInstance?.leadingIcon.setValue(this.leadingIcon());
        this.configSheet?.componentInstance?.leadingIcon.registerOnChange(() => {
            this.leadingIcon.set(this.configSheet?.componentInstance?.leadingIcon.value);
        });

        this.configSheet?.componentInstance?.trailingIcon.setValue(this.trailingIcon());
        this.configSheet?.componentInstance?.trailingIcon.registerOnChange(() => {
            this.trailingIcon.set(this.configSheet?.componentInstance?.trailingIcon.value);
        });

        this.configSheet?.componentInstance?.avatar.setValue(this.avatar());
        this.configSheet?.componentInstance?.avatar.registerOnChange(() => {
            this.avatar.set(this.configSheet?.componentInstance?.avatar.value);
        });

        this.filterIcons();
    }

    private filterIcons() {
        switch(this.chipType()) {
            case 'assist':
                this.configSheet?.componentInstance?.leadingIcon.enable();
                this.configSheet?.componentInstance?.avatar.disable();
                this.configSheet?.componentInstance?.trailingIcon.disable();

                this.configSheet?.componentInstance?.leadingIcon.setValue(true);
                this.configSheet?.componentInstance?.trailingIcon.setValue(false);
                break;
            case 'filter':
                this.configSheet?.componentInstance?.leadingIcon.disable();
                this.configSheet?.componentInstance?.avatar.disable();
                this.configSheet?.componentInstance?.trailingIcon.enable();

                this.configSheet?.componentInstance?.leadingIcon.setValue(false);
                this.configSheet?.componentInstance?.trailingIcon.setValue(false);
                break;
            case 'input':
                this.configSheet?.componentInstance?.leadingIcon.enable();
                this.configSheet?.componentInstance?.avatar.enable();
                this.configSheet?.componentInstance?.trailingIcon.disable();

                this.configSheet?.componentInstance?.leadingIcon.setValue(true);
                this.configSheet?.componentInstance?.trailingIcon.setValue(true);
                break;
            case 'suggestion':
                this.configSheet?.componentInstance?.leadingIcon.disable();
                this.configSheet?.componentInstance?.avatar.disable();
                this.configSheet?.componentInstance?.trailingIcon.disable();

                this.configSheet?.componentInstance?.leadingIcon.setValue(false);
                this.configSheet?.componentInstance?.trailingIcon.setValue(false);
                break;
        }

        this.configSheet?.componentInstance?.avatar.setValue(false);
    }
}

