import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonGroupSelection, ButtonSize, Checkbox, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-button-group-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Checkbox,
        RadioButton,
        InputElement,
        StateComponent,
        TypeBody,
        TypeLabel,
    ],
    templateUrl: './button-group-config.html',
    styleUrl: './button-group-config.scss',
})
export class ButtonGroupConfig {
    public buttonSize: FormControl = new FormControl<ButtonSize>('small');
    public isConntected: FormControl = new FormControl<boolean>(false);
    public selectionType: FormControl = new FormControl<ButtonGroupSelection>('none');

    constructor(
        private sideSheetRef: SideSheetRef<ButtonGroupConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
