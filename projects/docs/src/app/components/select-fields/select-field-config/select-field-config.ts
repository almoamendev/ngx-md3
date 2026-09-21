import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-select-field-config',
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
        TypeBody,
    ],
    templateUrl: './select-field-config.html',
    styleUrl: './select-field-config.scss',
})
export class SelectFieldConfig {
    public fieldType: FormControl = new FormControl<'filled' | 'outlined'>('filled');
    public menuColors: FormControl = new FormControl<'standard' | 'vibrant'>('standard');
    public multiple: FormControl = new FormControl<boolean>(false);
    public displayFormat: FormControl = new FormControl<'labels' | 'count' | 'summary'>('labels');
    public leadingIcon: FormControl = new FormControl<boolean>(false);
    public supportingText: FormControl = new FormControl<boolean>(false);
    public disabled: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<SelectFieldConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
