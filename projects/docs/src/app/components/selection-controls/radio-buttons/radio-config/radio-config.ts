import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-radio-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Switch,
        InputElement,
        StateComponent,
        TypeLabel,
    ],
    templateUrl: './radio-config.html',
    styleUrl: './radio-config.scss',
})
export class RadioConfig {
    public disableStateLayer: FormControl = new FormControl<boolean>(false);
    public disable: FormControl = new FormControl<boolean>(false);
    public setError: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<RadioConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
