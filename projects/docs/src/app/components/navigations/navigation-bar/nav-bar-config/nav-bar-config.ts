import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-nav-bar-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        RadioButton,
        InputElement,
        StateComponent,
        TypeLabel,
        TypeBody,
    ],
    templateUrl: './nav-bar-config.html',
    styleUrl: './nav-bar-config.scss',
})
export class NavBarConfig {
    public badge: FormControl = new FormControl<'none' | 'dot' | 'count'>('none');

    constructor(
        private sideSheetRef: SideSheetRef<NavBarConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
