import { Component, OnDestroy, signal } from '@angular/core';
import { Button, ButtonGroup, ButtonGroupSelection, ButtonGroupType, ButtonSize, Divider, IconButton, IconElement, MaterialIcon, SheetsService, SideSheetRef, TypeBody, TypeDisplay } from '@vip9008/ngx-md3';
import { ButtonGroupConfig } from './button-group-config/button-group-config';
import { Playground } from '../../playground/playground';
import { Shiki } from '../../shiki/shiki';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-button-groups',
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        ButtonGroup,
        Divider,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
        RouterLink,
    ],
    templateUrl: './button-groups.component.html',
    styleUrl: './button-groups.component.scss',
})
export class ButtonGroupsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ButtonGroupConfig> | undefined;
    public configOpen = signal(false);

    public buttonSize = signal<ButtonSize>('small');
    public groupType = signal<ButtonGroupType>('standard');
    public selection = signal<ButtonGroupSelection>('none');

    public apiImport: string = `// Component imports
import {
    ButtonGroup,
    Button, // optional
    IconButton, // optional
    MaterialIcon, // optional
    IconElement, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public buttonSize: InputSignal<ButtonSize> = input<ButtonSize>('small', {
    alias: 'button-size',
});
public groupType: InputSignal<ButtonGroupType> = input<ButtonGroupType>('standard', {
    alias: 'group-type',
});
public groupSelection: InputSignal<ButtonGroupSelection> = input<ButtonGroupSelection>('none', {
    alias: 'selection',
});`;

    public apiTypes: string = `// Types
import { ButtonSize, ButtonGroupType, ButtonGroupSelection } from '@vip9008/ngx-md3';

type ButtonSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
type ButtonGroupType = 'standard' | 'connected';
type ButtonGroupSelection = 'none' | 'single' | 'multiple';`;

    public apiUsage: string = `<!-- Component usage -->
<md3-button-group button-size="small" group-type="standard" selection="none">
    <!-- button -->
    <button md3-button>
        <md3-icon md3-icon-element>bluetooth</md3-icon>
        Bluetooth
    </button>
    .
    .
    .
    <!-- icon button -->
    <button md3-icon-button>
        <md3-icon md3-icon-element>alarm</md3-icon>
    </button>
    .
    .
    .
</md3-button-group>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(ButtonGroupConfig, {
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

        this.configSheet?.componentInstance?.isConntected.setValue(this.groupType() == 'connected');
        this.configSheet?.componentInstance?.isConntected.registerOnChange(() => {
            this.groupType.set(this.configSheet?.componentInstance?.isConntected.value ? 'connected' : 'standard');
        });

        this.configSheet?.componentInstance?.selectionType.setValue(this.selection());
        this.configSheet?.componentInstance?.selectionType.registerOnChange(() => {
            this.selection.set(this.configSheet?.componentInstance?.selectionType.value);
        });
    }
}
