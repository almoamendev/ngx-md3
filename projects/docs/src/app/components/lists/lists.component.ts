import { Component, OnDestroy, signal } from '@angular/core';
import { Checkbox, Divider, IconButton, IconElement, InputElement, List, ListItem, ListLeading, ListSlot, MaterialIcon, PrimaryAction, RadioButton, SheetsService, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { RouterLink } from '@angular/router';
import { ListConfig } from './list-config/list-config';

@Component({
    selector: 'app-lists',
    imports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
        PrimaryAction,
        MaterialIcon,
        IconButton,
        IconElement,
        Checkbox,
        RadioButton,
        InputElement,
        IconButton,
        MaterialIcon,
        IconElement,
        Divider,
        Playground,
        Shiki,
        TypeBody,
        RouterLink,
    ],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ListConfig> | undefined;
    public configOpen = signal(false);

    // public buttonSize = signal<ButtonSize>('small');
    // public groupType = signal<ButtonGroupType>('standard');
    // public selection = signal<ButtonGroupSelection>('none');

    public apiImport: string = `// Component imports
import {
    List,
    ListItem,
    ListSlot,
    ListLeading,
    PrimaryAction,
    MaterialIcon,
    IconButton,
    IconElement,
    Checkbox,
    RadioButton,
    InputElement,
    IconButton,
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

        this.configSheet = this.sheetsService.openSideSheet(ListConfig, {
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

        // this.configSheet?.componentInstance?.isConntected.setValue(this.groupType() == 'connected');
        // this.configSheet?.componentInstance?.isConntected.registerOnChange(() => {
        //     this.groupType.set(this.configSheet?.componentInstance?.isConntected.value ? 'connected' : 'standard');
        // });

        // this.configSheet?.componentInstance?.selectionType.setValue(this.selection());
        // this.configSheet?.componentInstance?.selectionType.registerOnChange(() => {
        //     this.selection.set(this.configSheet?.componentInstance?.selectionType.value);
        // });
    }
}
