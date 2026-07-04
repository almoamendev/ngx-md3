import { Component, computed, effect, OnDestroy, signal } from '@angular/core';
import { Checkbox, Divider, IconButton, IconElement, InputElement, List, ListItem, ListItemPrimaryAction, ListLeading, ListLeadingSize, ListLeadingType, ListSlot, MaterialIcon, RadioButton, SheetsService, SideSheetRef, Switch, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { ListConfig } from './list-config/list-config';

@Component({
    selector: 'app-lists',
    imports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
        ListItemPrimaryAction,
        MaterialIcon,
        IconButton,
        IconElement,
        Checkbox,
        RadioButton,
        Switch,
        InputElement,
        IconButton,
        MaterialIcon,
        IconElement,
        Divider,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnDestroy {
    private configSheet: SideSheetRef<ListConfig> | undefined;
    public configOpen = signal(false);

    // md3-list options
    public listVariant = signal<'expressive' | 'baseline'>('expressive');
    public listType = signal<'standard' | 'segmented'>('standard');

    // md3-list-item options
    public itemPrimaryAction = signal<boolean>(false);
    public itemSlotsAlignment = signal<'start' | 'center' | 'end'>('center');
    public itemSelected = signal<boolean>(false);
    public itemInput = signal<'checkbox' | 'radio' | 'switch'>('checkbox');

    // md3-list-leading options
    public leadingItem = signal<boolean>(true);
    public leadingType = signal<ListLeadingType>('icon');
    public leadingSize = signal<ListLeadingSize>('image');

    // md3-list-slot="trailing" options
    public trailingItem = signal<boolean>(true);

    public isSelectionInput = computed<boolean>(() => this.leadingItem() && this.leadingType() == 'selection-input');

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
        effect(() => {
            this.listVariantInit();
        });

        effect(() => {
            this.itemInit();
        });

        effect(() => {
            this.leadingItemInit();
        });
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

    private listVariantInit() {
        if (this.listVariant() == 'baseline') {
            this.configSheet?.componentInstance?.listType.disable();
        } else {
            this.configSheet?.componentInstance?.listType.enable();
        }
    }

    private itemInit() {
        if (this.isSelectionInput()) {
            this.configSheet?.componentInstance?.itemPrimaryAction.disable();
        } else {
            this.configSheet?.componentInstance?.itemPrimaryAction.enable();
        }
    }

    private leadingItemInit() {
        const visible = this.leadingItem();
        if (visible) {
            this.configSheet?.componentInstance?.leadingType.enable();
            this.leadingTypeInit();
        } else {
            this.configSheet?.componentInstance?.leadingType.disable();
            this.configSheet?.componentInstance?.leadingSize.disable();
            this.configSheet?.componentInstance?.itemSelected.enable();
            this.configSheet?.componentInstance?.itemInput.disable();
        }
    }

    private leadingTypeInit() {
        const type = this.leadingType();
        if (type == 'media') {
            this.configSheet?.componentInstance?.leadingSize.enable();
        } else {
            this.configSheet?.componentInstance?.leadingSize.disable();
        }

        if (type == 'selection-input') {
            this.configSheet?.componentInstance?.itemSelected.disable();
            this.configSheet?.componentInstance?.itemInput.enable();
        } else {
            this.configSheet?.componentInstance?.itemSelected.enable();
            this.configSheet?.componentInstance?.itemInput.disable();
        }
    }

    private registerConfigEvents() {
        // md3-list options
        this.configSheet?.componentInstance?.listVariant.setValue(this.listVariant());
        this.configSheet?.componentInstance?.listVariant.registerOnChange(() => {
            this.listVariant.set(this.configSheet?.componentInstance?.listVariant.value);
        });
        this.configSheet?.componentInstance?.listType.setValue(this.listType());
        this.configSheet?.componentInstance?.listType.registerOnChange(() => {
            this.listType.set(this.configSheet?.componentInstance?.listType.value);
        });
        
        // md3-list-item options
        this.configSheet?.componentInstance?.itemPrimaryAction.setValue(this.itemPrimaryAction());
        this.configSheet?.componentInstance?.itemPrimaryAction.registerOnChange(() => {
            this.itemPrimaryAction.set(this.configSheet?.componentInstance?.itemPrimaryAction.value);
        });
        this.configSheet?.componentInstance?.itemSlotsAlignment.setValue(this.itemSlotsAlignment());
        this.configSheet?.componentInstance?.itemSlotsAlignment.registerOnChange(() => {
            this.itemSlotsAlignment.set(this.configSheet?.componentInstance?.itemSlotsAlignment.value);
        });
        this.configSheet?.componentInstance?.itemSelected.setValue(this.itemSelected());
        this.configSheet?.componentInstance?.itemSelected.registerOnChange(() => {
            this.itemSelected.set(this.configSheet?.componentInstance?.itemSelected.value);
        });
        this.configSheet?.componentInstance?.itemInput.setValue(this.itemInput());
        this.configSheet?.componentInstance?.itemInput.registerOnChange(() => {
            this.itemInput.set(this.configSheet?.componentInstance?.itemInput.value);
        });
        
        // md3-list-leading options
        this.configSheet?.componentInstance?.leadingItem.setValue(this.leadingItem());
        this.configSheet?.componentInstance?.leadingItem.registerOnChange(() => {
            this.leadingItem.set(this.configSheet?.componentInstance?.leadingItem.value);
        });
        this.configSheet?.componentInstance?.leadingType.setValue(this.leadingType());
        this.configSheet?.componentInstance?.leadingType.registerOnChange(() => {
            this.leadingType.set(this.configSheet?.componentInstance?.leadingType.value);
        });
        this.configSheet?.componentInstance?.leadingSize.setValue(this.leadingSize());
        this.configSheet?.componentInstance?.leadingSize.registerOnChange(() => {
            this.leadingSize.set(this.configSheet?.componentInstance?.leadingSize.value);
        });

        this.listVariantInit();
        this.itemInit();
        this.leadingItemInit();
    }
}
