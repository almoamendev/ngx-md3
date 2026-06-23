import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonSize, IconButton, IconButtonType, IconButtonWidth, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-icon-button-config',
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
    templateUrl: './icon-button-config.html',
    styleUrl: './icon-button-config.scss',
})
export class IconButtonConfig {
    public buttonSize: FormControl = new FormControl<ButtonSize>('small');
    public buttonType: FormControl = new FormControl<IconButtonType>('filled');
    public buttonWidth: FormControl = new FormControl<IconButtonWidth>('default');
    public isSquared: FormControl = new FormControl<boolean>(false);
    public isSelected: FormControl = new FormControl<'none' | 'toggle'>('none');

    constructor(
        private sideSheetRef: SideSheetRef<IconButtonConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
