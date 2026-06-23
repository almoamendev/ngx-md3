import { Component, OnDestroy, signal } from '@angular/core';
import { ButtonSize, IconButton, IconButtonType, IconButtonWidth, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody } from "@vip9008/ngx-md3";
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { IconButtonConfig } from './icon-button-config/icon-button-config';

@Component({
    selector: 'app-icon-buttons',
    imports: [
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './icon-buttons.component.html',
    styleUrl: './icon-buttons.component.scss',
})
export class IconButtonsComponent implements OnDestroy {
    private configSheet: SideSheetRef<IconButtonConfig> | undefined;
    public configOpen = signal(false);

    public buttonSize = signal<ButtonSize>('small');
    public buttonType = signal<IconButtonType>('filled');
    public buttonWidth = signal<IconButtonWidth>('default');
    public isSquared = signal<boolean>(false);
    public isSelected = signal<boolean | null>(null);

    public apiImport: string = `// Component imports
import {
    IconButton,
    MaterialIcon, // optional
    IconElement, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public buttonSize = input<ButtonSize>('small', {
    alias: 'button-size',
});
public buttonType = input<IconButtonType>('filled', {
    alias: 'button-type',
});
public buttonWidth = input<IconButtonWidth>('default', {
    alias: 'button-width',
});
public isSquared = input<boolean, unknown>(false, {
    alias: 'button-squared',
    transform: booleanAttribute
});
public isSelected = model<boolean | null>(null, {
    alias: 'selected',
});`;

    public apiTypes: string = `// Types
import { ButtonSize, IconButtonType, IconButtonWidth } from '@vip9008/ngx-md3';

type ButtonSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
type IconButtonType = 'filled' | 'tonal' | 'outlined' | 'standard';
type IconButtonWidth = 'default' | 'narrow' | 'wide';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- md3-icon-button can be used on <button> or <a> -->
<button md3-icon-button>
    ...
</button>
<a href="" md3-icon-button>
    ...
</a>

<!-- using material icons -->
<button md3-icon-button button-size="small" button-type="filled" button-width="default" button-squared [selected]="null">
    <md3-icon md3-icon-element>person</md3-icon>
</button>

<!-- using custom icon -->
<button md3-icon-button button-size="small" button-type="filled" button-width="default" [button-squared]="true" [selected]="null">
    <your-custom-icon-element md3-icon-element></your-custom-icon-element>
</button>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(IconButtonConfig, {
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

        this.configSheet?.componentInstance?.buttonType.setValue(this.buttonType());
        this.configSheet?.componentInstance?.buttonType.registerOnChange(() => {
            this.buttonType.set(this.configSheet?.componentInstance?.buttonType.value);
        });

        this.configSheet?.componentInstance?.buttonWidth.setValue(this.buttonWidth());
        this.configSheet?.componentInstance?.buttonWidth.registerOnChange(() => {
            this.buttonWidth.set(this.configSheet?.componentInstance?.buttonWidth.value);
        });

        this.configSheet?.componentInstance?.isSquared.setValue(this.isSquared());
        this.configSheet?.componentInstance?.isSquared.registerOnChange(() => {
            this.isSquared.set(this.configSheet?.componentInstance?.isSquared.value);
        });

        this.configSheet?.componentInstance?.isSelected.setValue(this.isSelected() === null ? 'none' : 'toggle');
        this.configSheet?.componentInstance?.isSelected.registerOnChange(() => {
            const selection = this.configSheet?.componentInstance?.isSelected.value;
            this.isSelected.set(selection == 'none' ? null : false);
        });
    }
}
