import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, ListLeadingSize, ListLeadingType, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeLabel, Divider } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-list-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        RadioButton,
        Switch,
        InputElement,
        StateComponent,
        TypeLabel,
        Divider
    ],
    templateUrl: './list-config.html',
    styleUrl: './list-config.scss',
})
export class ListConfig {
    // md3-list options
    public listVariant: FormControl = new FormControl<'expressive' | 'baseline'>('expressive');
    public listType: FormControl = new FormControl<'standard' | 'segmented'>('standard');

    // md3-list-item options
    public supportingText: FormControl = new FormControl<boolean>(true);
    public itemDisabled: FormControl = new FormControl<boolean>(false);
    public itemPrimaryAction: FormControl = new FormControl<boolean>(false);
    public itemSlotsAlignment: FormControl = new FormControl<'start' | 'center' | 'end'>('center');
    public itemSelected: FormControl = new FormControl<boolean>(false);
    public itemInput: FormControl = new FormControl<'checkbox' | 'radio' | 'switch'>('checkbox');

    // md3-list-leading options
    public leadingItem: FormControl = new FormControl<boolean>(true);
    public leadingType: FormControl = new FormControl<ListLeadingType>('icon');
    public leadingSize: FormControl = new FormControl<ListLeadingSize>('image');
    public leadingInput: FormControl = new FormControl<boolean>(false);
    
    // md3-list-slot="trailing" options
    public trailingItem: FormControl = new FormControl<boolean>(true);
    public trailingType: FormControl = new FormControl<string>('text');
    public trailingInput: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<ListConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
