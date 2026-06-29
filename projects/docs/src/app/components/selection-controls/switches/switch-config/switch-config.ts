import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-switch-config',
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
        TypeBody,
    ],
    templateUrl: './switch-config.html',
    styleUrl: './switch-config.scss',
})
export class SwitchConfig {
    public disableStateLayer: FormControl = new FormControl<boolean>(false);
    public disable: FormControl = new FormControl<boolean>(false);
    public singleIcon: FormControl = new FormControl<boolean>(false);
    public unselectedIcon: FormControl = new FormControl<boolean>(false);
    public selectedIcon: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<SwitchConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
