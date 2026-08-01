import { Component, OnDestroy, signal } from '@angular/core';
import { Checkbox, IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@almoamendev/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { CheckboxConfig } from './checkbox-config/checkbox-config';

@Component({
    selector: 'app-checkboxes',
    imports: [
        Checkbox,
        InputElement,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './checkboxes.component.html',
    styleUrl: './checkboxes.component.scss',
})
export class CheckboxesComponent implements OnDestroy {
    private configSheet: SideSheetRef<CheckboxConfig> | undefined;
    public configOpen = signal(false);

    public disableStateLayer = signal<boolean>(false);
    public disable = signal<boolean>(false);
    public setError = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Checkbox,
    InputElement,
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// Inputs
public control = input<AbstractControl | undefined>(undefined, {
    alias: 'control',
});
public disableStateLayer = input<boolean, unknown>(false, {
    alias: 'disable-state-layer',
    transform: booleanAttribute
});`;

    public apiUsage: string = `<!-- Component usage -->

<!-- regular checkbox input -->
<md3-checkbox [disable-state-layer]="false">
    <input type="checkbox" md3-input-element>
</md3-checkbox>

<!-- checkbox input using form control -->
<md3-checkbox [disable-state-layer]="false" [control]="checkboxControl">
    <input type="checkbox" md3-input-element>
</md3-checkbox>

<!-- checkbox input using form control name directive -->
<md3-checkbox [disable-state-layer]="false">
    <input type="checkbox" md3-input-element formControlName="checkboxControlName">
</md3-checkbox>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(CheckboxConfig, {
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
