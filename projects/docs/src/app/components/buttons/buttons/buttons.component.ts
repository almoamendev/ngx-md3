import { Component, OnDestroy, signal } from '@angular/core';
import { Button, ButtonSize, ButtonType, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { ButtonConfig } from './button-config/button-config';

@Component({
    selector: 'app-buttons',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './buttons.component.html',
    styleUrl: './buttons.component.scss',
})
export class ButtonsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ButtonConfig> | undefined;
    public configOpen = signal(false);

    public showIcon = signal<boolean>(true);
    public buttonSize = signal<ButtonSize>('small');
    public buttonType = signal<ButtonType>('filled');
    public isSquared = signal<boolean>(false);
    public isSelected = signal<boolean | null>(null);

    public apiImport: string = `// Component imports
import {
    Button,
    MaterialIcon, // optional
    IconElement, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public buttonSize = input<ButtonSize>('small', {
    alias: 'button-size',
});
public buttonType = input<ButtonType>('filled', {
    alias: 'button-type',
});
public isSquared = input<boolean, unknown>(false, {
    alias: 'button-squared',
    transform: booleanAttribute,
});
public isSelected = model<boolean | null>(null, {
    alias: 'selected',
});`;

    public apiTypes: string = `// Types
import { ButtonSize, ButtonType } from '@vip9008/ngx-md3';

type ButtonSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
type ButtonType = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- md3-button can be used on <button> or <a> -->
<button md3-button>
    ...
</button>
<a href="" md3-button>
    ...
</a>

<!-- no icon -->
<button md3-button button-size="small" button-type="filled" [button-squared]="false" [selected]="null">
    Bluetooth
</button>

<!-- using material icons -->
<button md3-button button-size="small" button-type="filled" button-squared [selected]="null">
    <md3-icon md3-icon-element>bluetooth</md3-icon>
    Bluetooth
</button>

<!-- using custom icon -->
<button md3-button button-size="small" button-type="filled" [button-squared]="true" [selected]="null">
    <your-custom-icon-element md3-icon-element></your-custom-icon-element>
    Bluetooth
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

        this.configSheet = this.sheetsService.openSideSheet(ButtonConfig, {
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

        this.configSheet?.componentInstance?.buttonSize.setValue(this.buttonSize());
        this.configSheet?.componentInstance?.buttonSize.registerOnChange(() => {
            this.buttonSize.set(this.configSheet?.componentInstance?.buttonSize.value);
        });

        this.configSheet?.componentInstance?.buttonType.setValue(this.buttonType());
        this.configSheet?.componentInstance?.buttonType.registerOnChange(() => {
            this.buttonType.set(this.configSheet?.componentInstance?.buttonType.value);
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
