import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonSize, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, SplitButtonType, StateComponent, Switch, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-split-button-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Switch,
        RadioButton,
        InputElement,
        StateComponent,
        TypeBody,
        TypeLabel,
    ],
    templateUrl: './split-button-config.html',
    styleUrl: './split-button-config.scss',
})
export class SplitButtonConfig {
    public primaryButton: FormControl = new FormControl<'icon' | 'button'>('icon');
    public buttonSize: FormControl = new FormControl<ButtonSize>('small');
    public buttonType: FormControl = new FormControl<SplitButtonType>('filled');
    public flipTrailingIcon: FormControl = new FormControl<boolean>(true);

    constructor(
        private sideSheetRef: SideSheetRef<SplitButtonConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
