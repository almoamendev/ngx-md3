import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-checkbox-config',
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
    templateUrl: './checkbox-config.html',
    styleUrl: './checkbox-config.scss',
})
export class CheckboxConfig {
    public disableStateLayer: FormControl = new FormControl<boolean>(false);
    public disable: FormControl = new FormControl<boolean>(false);
    public setError: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<CheckboxConfig>
    ) {
        this.disableStateLayer.disable();
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
