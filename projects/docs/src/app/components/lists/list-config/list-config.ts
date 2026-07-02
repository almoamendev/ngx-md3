import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, ListLeadingSize, ListLeadingType, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeLabel } from '@vip9008/ngx-md3';

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
    ],
    templateUrl: './list-config.html',
    styleUrl: './list-config.scss',
})
export class ListConfig {
    // md3-list options
    public listVariant: FormControl = new FormControl<'expressive' | 'baseline'>('expressive');
    public listType: FormControl = new FormControl<'standard' | 'segmented'>('standard');

    // md3-list-item options
    public itemSlotsAlignment: FormControl = new FormControl<'start' | 'center' | 'end'>('center');
    public itemSelected: FormControl = new FormControl<boolean>(false);

    // md3-list-leading options
    public leadingType: FormControl = new FormControl<ListLeadingType>('icon');
    public leadingSize: FormControl = new FormControl<ListLeadingSize>('image');

    constructor(
        private sideSheetRef: SideSheetRef<ListConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
