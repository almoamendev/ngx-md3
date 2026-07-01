import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChipType, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-chips-config',
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
        TypeLabel,
    ],
    templateUrl: './chips-config.html',
    styleUrl: './chips-config.scss',
})
export class ChipsConfig {
    public chipType: FormControl = new FormControl<ChipType>('assist');
    public hasSurface: FormControl = new FormControl<boolean>(false);
    public isElevated: FormControl = new FormControl<boolean>(false);
    public disabled: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<ChipsConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
