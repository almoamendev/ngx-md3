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
        MaterialIcon,
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
    public supportingText = signal<boolean>(true);
    public itemDisabled = signal<boolean>(false);
    public itemPrimaryAction = signal<boolean>(false);
    public itemSlotsAlignment = signal<'start' | 'center' | 'end'>('center');
    public itemSelected = signal<boolean>(false);
    public itemInput = signal<'checkbox' | 'radio' | 'switch'>('checkbox');

    // md3-list-leading options
    public leadingItem = signal<boolean>(true);
    public leadingType = signal<ListLeadingType>('icon');
    public leadingSize = signal<ListLeadingSize>('image');
    public leadingInput = signal<boolean>(false);

    // md3-list-slot="trailing" options
    public trailingItem = signal<boolean>(true);
    public trailingType = signal<string>('text');
    public trailingInput = signal<boolean>(false);

    public isLeadingInput = computed<boolean>(() => {
        return this.leadingItem() && this.leadingInput();
    });
    public isTrailingInput = computed<boolean>(() => {
        return this.trailingItem() && this.trailingInput();
    });
    public isSelectionInput = computed<boolean>(() => {
        return this.isLeadingInput() || this.isTrailingInput();
    });

    public apiImport: string = `// Component imports
import {
    List,
    ListItem,
    ListSlot,
    ListLeading, // optional
    ListItemPrimaryAction, // optional
    MaterialIcon, // optional
    IconButton, // optional
    IconElement, // optional
    Checkbox, // optional
    RadioButton, // optional
    InputElement, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs

// md3-list
public variant = input<'expressive' | 'baseline'>('expressive');
public type = input<'standard' | 'segmented'>('standard');

// md3-list-item
public slotsAlignment = input<'start' | 'center' | 'end'>('center', {
    alias: 'slots-alignment',
});
public selected = input<boolean, unknown>(false, {
    transform: booleanAttribute,
});

// md3-list-leading
public type = input<ListLeadingType>('icon');
public size = input<ListLeadingSize>('image');

// md3-list-slot
public position = input.required<'content' | 'trailing'>({
    alias: 'md3-list-slot',
});`;

    public apiTypes: string = `// Types
import { ListLeadingType, ListLeadingSize } from '@vip9008/ngx-md3';

type ListLeadingType = 'icon' | 'avatar' | 'media' | 'selection-input';
type ListLeadingSize = 'image' | 'small-video' | 'large-video';`;

    public apiUsage: string = `<!-- Component usage -->

<!-- md3-list-item can be used as <md3-list-item>, <label[md3-list-item]>, <button[md3-list-item]> or <a[md3-list-item]> -->
<md3-list variant="expressive" type="standard">
    <md3-list-item>...</md3-list-item>
    <label md3-list-item>...</label>
    <button md3-list-item>...</button>
    <a md3-list-item>...</a>
</md3-list>

<md3-list variant="expressive" type="standard">
    <!-- regular list item -->
    <md3-list-item slots-alignment="center" [selected]="false">
        <button md3-item-primary-action></button> <!-- optional -->
        <md3-list-leading type="..." size="...">...</md3-list-leading> <!-- optional -->
        <div md3-list-slot="content">
            Label
            <div md3-type-body="small" color="on-surface-variant">Supporting text</div> <!-- optional -->
        </div>
        <div md3-list-slot="trailing">...</div> <!-- optional -->
    </md3-list-item>

    <!-- list item with selection input -->
    <label md3-list-item>
        <md3-list-leading type="selection-input">
            <!-- md3-checkbox, md3-radio-button or md3-switch -->
            <md3-checkbox [disable-state-layer]="true">
                <input type="checkbox" md3-input-element>
            </md3-checkbox>
        </md3-list-leading>
        <div md3-list-slot="content">Label</div>
        <div md3-list-slot="trailing">...</div> <!-- optional -->
    </label>
    <label md3-list-item>
        <md3-list-leading type="..." size="...">...</md3-list-leading> <!-- optional -->
        <div md3-list-slot="content">Label</div>
        <div md3-list-slot="trailing">
            <!-- md3-checkbox, md3-radio-button or md3-switch -->
            <md3-checkbox [disable-state-layer]="true">
                <input type="checkbox" md3-input-element>
            </md3-checkbox>
        </div>
    </label>
</md3-list>
`;

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

        effect(() => {
            this.trailingItemInit();
        })

        effect(() => {
            if (this.leadingInput()) {
                this.configSheet?.componentInstance?.trailingInput.setValue(false);
            }
        });

        effect(() => {
            if (this.trailingInput()) {
                this.configSheet?.componentInstance?.leadingInput.setValue(false);
            }
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
        const input = this.isSelectionInput();
        const primary = this.itemPrimaryAction();
        if (input) {
            this.configSheet?.componentInstance?.itemSelected.disable();
            this.configSheet?.componentInstance?.itemPrimaryAction.disable();
            this.configSheet?.componentInstance?.itemInput.enable();
        } else {
            this.configSheet?.componentInstance?.itemSelected.enable();
            this.configSheet?.componentInstance?.itemPrimaryAction.enable();
            this.configSheet?.componentInstance?.itemInput.disable();
        }

        if (input || primary) {
            this.configSheet?.componentInstance?.itemDisabled.enable();
        } else {
            this.configSheet?.componentInstance?.itemDisabled.disable();
        }
    }

    private leadingItemInit() {
        const visible = this.leadingItem();
        if (visible) {
            this.configSheet?.componentInstance?.leadingInput.enable();

            if (this.leadingInput()) {
                this.configSheet?.componentInstance?.leadingType.disable();
                this.configSheet?.componentInstance?.leadingSize.disable();
                return;
            }

            this.configSheet?.componentInstance?.leadingType.enable();
            if (this.leadingType() == 'media') {
                this.configSheet?.componentInstance?.leadingSize.enable();
            } else {
                this.configSheet?.componentInstance?.leadingSize.disable();
            }
        } else {
            this.configSheet?.componentInstance?.leadingType.disable();
            this.configSheet?.componentInstance?.leadingSize.disable();
            this.configSheet?.componentInstance?.itemSelected.enable();
            this.configSheet?.componentInstance?.itemInput.disable();
            this.configSheet?.componentInstance?.leadingInput.disable();
        }
    }

    private trailingItemInit() {
        const visible = this.trailingItem();
        if (visible) {
            if (this.trailingInput()) {
                this.configSheet?.componentInstance?.trailingType.disable();
                return;
            }

            this.configSheet?.componentInstance?.trailingInput.enable();
            this.configSheet?.componentInstance?.trailingType.enable();
        } else {
            this.configSheet?.componentInstance?.trailingInput.disable();
            this.configSheet?.componentInstance?.trailingType.disable();
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
        this.configSheet?.componentInstance?.supportingText.setValue(this.supportingText());
        this.configSheet?.componentInstance?.supportingText.registerOnChange(() => {
            this.supportingText.set(this.configSheet?.componentInstance?.supportingText.value);
        });
        this.configSheet?.componentInstance?.itemDisabled.setValue(this.itemDisabled());
        this.configSheet?.componentInstance?.itemDisabled.registerOnChange(() => {
            this.itemDisabled.set(this.configSheet?.componentInstance?.itemDisabled.value);
        });
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
        this.configSheet?.componentInstance?.leadingInput.setValue(this.leadingInput());
        this.configSheet?.componentInstance?.leadingInput.registerOnChange(() => {
            this.leadingInput.set(this.configSheet?.componentInstance?.leadingInput.value);
        });
        this.configSheet?.componentInstance?.leadingType.setValue(this.leadingType());
        this.configSheet?.componentInstance?.leadingType.registerOnChange(() => {
            this.leadingType.set(this.configSheet?.componentInstance?.leadingType.value);
        });
        this.configSheet?.componentInstance?.leadingSize.setValue(this.leadingSize());
        this.configSheet?.componentInstance?.leadingSize.registerOnChange(() => {
            this.leadingSize.set(this.configSheet?.componentInstance?.leadingSize.value);
        });

        // md3-list-slot="trailing" options
        this.configSheet?.componentInstance?.trailingItem.setValue(this.trailingItem());
        this.configSheet?.componentInstance?.trailingItem.registerOnChange(() => {
            this.trailingItem.set(this.configSheet?.componentInstance?.trailingItem.value);
        });
        this.configSheet?.componentInstance?.trailingInput.setValue(this.trailingInput());
        this.configSheet?.componentInstance?.trailingInput.registerOnChange(() => {
            this.trailingInput.set(this.configSheet?.componentInstance?.trailingInput.value);
        });
        this.configSheet?.componentInstance?.trailingType.setValue(this.trailingType());
        this.configSheet?.componentInstance?.trailingType.registerOnChange(() => {
            this.trailingType.set(this.configSheet?.componentInstance?.trailingType.value);
        });

        this.listVariantInit();
        this.itemInit();
        this.leadingItemInit();
        this.trailingItemInit();
    }
}
