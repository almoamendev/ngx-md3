import { Component, effect, OnDestroy, signal } from '@angular/core';
import { IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, Switch, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { SwitchConfig } from './switch-config/switch-config';

@Component({
    selector: 'app-switches',
    imports: [
        Switch,
        InputElement,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './switches.component.html',
    styleUrl: './switches.component.scss',
})
export class SwitchesComponent implements OnDestroy {
    private configSheet: SideSheetRef<SwitchConfig> | undefined;
    public configOpen = signal(false);

    public disableStateLayer = signal<boolean>(false);
    public disable = signal<boolean>(false);
    public singleIcon = signal<boolean>(false);
    public unselectedIcon = signal<boolean>(false);
    public selectedIcon = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    Switch,
    InputElement,
    IconElement, // optional
    MaterialIcon, // optional
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

<!-- regular switch input -->
<md3-switch [disable-state-layer]="false">
    <input type="checkbox" md3-input-element>
</md3-switch>

<!-- switch input with icon -->
<md3-switch [disable-state-layer]="false">
    <input type="checkbox" md3-input-element>
    <md3-icon md3-icon-element>volume_up</md3-icon> <!-- optional -->
</md3-switch>
<!-- custom icon -->
<md3-switch [disable-state-layer]="false">
    <input type="checkbox" md3-input-element>
    <your-custom-icon-element md3-icon-element></your-custom-icon-element> <!-- optional -->
</md3-switch>

<!-- switch input with unselected and selected icons -->
<md3-switch [disable-state-layer]="false">
    <input type="checkbox" md3-input-element>
    <md3-icon md3-icon-element="unselected">close</md3-icon> <!-- optional -->
    <md3-icon md3-icon-element="selected">check</md3-icon> <!-- optional -->
</md3-switch>
<!-- custom icons -->
<md3-switch [disable-state-layer]="false">
    <input type="checkbox" md3-input-element>
    <your-custom-icon-element md3-icon-element="unselected"></your-custom-icon-element> <!-- optional -->
    <your-custom-icon-element md3-icon-element="selected"></your-custom-icon-element> <!-- optional -->
</md3-switch>

<!-- switch input using form control -->
<md3-switch [disable-state-layer]="false" [control]="switchControl">
    <input type="checkbox" md3-input-element>
</md3-switch>

<!-- switch input using form control name directive -->
<md3-switch [disable-state-layer]="false">
    <input type="checkbox" md3-input-element formControlName="switchControlName">
</md3-switch>`;
    
    constructor(
        private sheetsService: SheetsService,
    ) {
        effect(() => {
            if (this.singleIcon()) {
                this.configSheet?.componentInstance?.unselectedIcon.setValue(false);
                this.configSheet?.componentInstance?.selectedIcon.setValue(false);
            }
        });

        effect(() => {
            if (this.unselectedIcon() || this.selectedIcon()) {
                this.configSheet?.componentInstance?.singleIcon.setValue(false);
            }
        });
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(SwitchConfig, {
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

        this.configSheet?.componentInstance?.singleIcon.setValue(this.singleIcon());
        this.configSheet?.componentInstance?.singleIcon.registerOnChange(() => {
            this.singleIcon.set(this.configSheet?.componentInstance?.singleIcon.value);
        });

        this.configSheet?.componentInstance?.unselectedIcon.setValue(this.unselectedIcon());
        this.configSheet?.componentInstance?.unselectedIcon.registerOnChange(() => {
            this.unselectedIcon.set(this.configSheet?.componentInstance?.unselectedIcon.value);
        });

        this.configSheet?.componentInstance?.selectedIcon.setValue(this.selectedIcon());
        this.configSheet?.componentInstance?.selectedIcon.registerOnChange(() => {
            this.selectedIcon.set(this.configSheet?.componentInstance?.selectedIcon.value);
        });
    }
}
