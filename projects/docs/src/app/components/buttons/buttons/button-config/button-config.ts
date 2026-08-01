import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonSize, ButtonType, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-button-config',
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
    templateUrl: './button-config.html',
    styleUrl: './button-config.scss',
})
export class ButtonConfig {
    public showIcon: FormControl = new FormControl<boolean>(true);
    public buttonSize: FormControl = new FormControl<ButtonSize>('small');
    public buttonType: FormControl = new FormControl<ButtonType>('filled');
    public isSquared: FormControl = new FormControl<boolean>(false);
    public isSelected: FormControl = new FormControl<'none' | 'toggle'>('none');

    constructor(
        private sideSheetRef: SideSheetRef<ButtonConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
