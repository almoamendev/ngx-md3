import { Component, OnDestroy, signal } from '@angular/core';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@vip9008/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { RadioConfig } from './radio-config/radio-config';

@Component({
    selector: 'app-radio-buttons',
    imports: [
        RadioButton,
        InputElement,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './radio-buttons.component.html',
    styleUrl: './radio-buttons.component.scss',
})
export class RadioButtonsComponent implements OnDestroy {
    private configSheet: SideSheetRef<RadioConfig> | undefined;
    public configOpen = signal(false);

    public disableStateLayer = signal<boolean>(false);
    public disable = signal<boolean>(false);
    public setError = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    RadioButton,
    InputElement,
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public control = input<AbstractControl | undefined>(undefined, {
    alias: 'control',
});
public disableStateLayer = input<boolean, unknown>(false, {
    alias: 'disable-state-layer',
    transform: booleanAttribute
});`;

    public apiUsage: string = `<!-- Component usage -->

<!-- regular radio button input -->
<md3-radio-button [disable-state-layer]="false">
    <input type="radio" md3-input-element>
</md3-radio-button>

<!-- radio button input using form control -->
<md3-radio-button [disable-state-layer]="false" [control]="radioControl">
    <input type="radio" md3-input-element>
</md3-radio-button>

<!-- radio button input using form control name directive -->
<md3-radio-button [disable-state-layer]="false">
    <input type="radio" md3-input-element formControlName="radioControlName">
</md3-radio-button>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(RadioConfig, {
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
        this.configSheet?.componentInstance?.disableStateLayer.setValue(this.disableStateLayer());
        this.configSheet?.componentInstance?.disableStateLayer.registerOnChange(() => {
            this.disableStateLayer.set(this.configSheet?.componentInstance?.disableStateLayer.value);
        });

        this.configSheet?.componentInstance?.disable.setValue(this.disable());
        this.configSheet?.componentInstance?.disable.registerOnChange(() => {
            this.disable.set(this.configSheet?.componentInstance?.disable.value);
        });
        
        this.configSheet?.componentInstance?.setError.setValue(this.setError());
        this.configSheet?.componentInstance?.setError.registerOnChange(() => {
            this.setError.set(this.configSheet?.componentInstance?.setError.value);
        });
    }
}

