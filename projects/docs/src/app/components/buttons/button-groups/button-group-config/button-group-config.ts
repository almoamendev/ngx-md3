import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonGroupSelection, ButtonSize, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-button-group-config',
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
