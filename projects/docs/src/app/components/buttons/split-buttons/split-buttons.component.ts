import { Component, OnDestroy, signal } from '@angular/core';
import { Button, ButtonSize, Divider, IconButton, IconElement, MaterialIcon, MenuService, SheetsService, SideSheetRef, SplitButton, SplitButtonType, TypeBody } from '@vip9008/ngx-md3';
import { SmapleMenu } from '../../menus/smaple-menu/smaple-menu';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { SplitButtonConfig } from './split-button-config/split-button-config';

@Component({
    selector: 'app-split-buttons',
    imports: [
        SplitButton,
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Divider,
        Shiki,
        TypeBody,
    ],
    templateUrl: './split-buttons.component.html',
    styleUrl: './split-buttons.component.scss',
})
export class SplitButtonsComponent implements OnDestroy {
    private configSheet: SideSheetRef<SplitButtonConfig> | undefined;
    public configOpen = signal(false);

    public primaryButton = signal<'icon' | 'button'>('icon');
    public buttonSize = signal<ButtonSize>('small');
    public buttonType = signal<SplitButtonType>('filled');
    public flipTrailingIcon = signal<boolean>(true);

    public apiImport: string = `// Component imports
import {
    SplitButton,
    IconButton,
    IconElement,
    Button, // optional
    MaterialIcon, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public buttonSize = input<ButtonSize>('small', {
    alias: 'button-size',
});
public buttonType = input<SplitButtonType>('filled', {
    alias: 'button-type',
});

public flipTrailingIcon = input<boolean, unknown>(true, {
    alias: 'flip-trailing-icon',
    transform: booleanAttribute,
});`;

    public apiTypes: string = `// Types
import { ButtonSize, SplitButtonType } from '@vip9008/ngx-md3';

type ButtonSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
type SplitButtonType = 'elevated' | 'filled' | 'tonal' | 'outlined';`;

    public apiUsage: string = `<!-- Component usage -->

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
        private menuService: MenuService,
        private sheetsService: SheetsService,
    ) {}

    public openMenu(
        event: MouseEvent,
    ) {
        this.menuService.open(SmapleMenu, {
            data: {
                simple: true,
            },
            bindDataToInputs: true,
            xPosition: 'end',
            yPosition: 'below',
            origin: event,
        });
    }
    
    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(SplitButtonConfig, {
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
        this.configSheet?.componentInstance?.primaryButton.setValue(this.primaryButton());
        this.configSheet?.componentInstance?.primaryButton.registerOnChange(() => {
            this.primaryButton.set(this.configSheet?.componentInstance?.primaryButton.value);
        });

        this.configSheet?.componentInstance?.buttonSize.setValue(this.buttonSize());
        this.configSheet?.componentInstance?.buttonSize.registerOnChange(() => {
            this.buttonSize.set(this.configSheet?.componentInstance?.buttonSize.value);
        });

        this.configSheet?.componentInstance?.buttonType.setValue(this.buttonType());
        this.configSheet?.componentInstance?.buttonType.registerOnChange(() => {
            this.buttonType.set(this.configSheet?.componentInstance?.buttonType.value);
        });

        this.configSheet?.componentInstance?.flipTrailingIcon.setValue(this.flipTrailingIcon());
        this.configSheet?.componentInstance?.flipTrailingIcon.registerOnChange(() => {
            this.flipTrailingIcon.set(this.configSheet?.componentInstance?.flipTrailingIcon.value);
        });
    }
}
