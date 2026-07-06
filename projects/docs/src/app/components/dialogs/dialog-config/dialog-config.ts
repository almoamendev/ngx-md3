import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-dialog-config',
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
    templateUrl: './dialog-config.html',
    styleUrl: './dialog-config.scss',
})
export class DialogConfig {
    public showIcon: FormControl = new FormControl<boolean>(true);
    public closeEvents: FormControl = new FormControl<boolean>(true);
    public darkMode: FormControl = new FormControl<boolean>(true);
    public direction: FormControl = new FormControl<'ltr' | 'rtl'>('ltr');

    constructor(
        private sideSheetRef: SideSheetRef<DialogConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
