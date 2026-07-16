import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-text-field-config',
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
    templateUrl: './text-field-config.html',
    styleUrl: './text-field-config.scss',
})
export class TextFieldConfig {
    public fieldType: FormControl = new FormControl<'filled' | 'outlined'>('filled');
    public leadingIcon: FormControl = new FormControl<boolean>(false);
    public trailingIcon: FormControl = new FormControl<'none' | 'icon' | 'button'>('none');
    public supportingText: FormControl = new FormControl<boolean>(false);
    public counter: FormControl = new FormControl<boolean>(false);
    public textarea: FormControl = new FormControl<boolean>(false);
    public disabled: FormControl = new FormControl<boolean>(false);
    public error: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<TextFieldConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
