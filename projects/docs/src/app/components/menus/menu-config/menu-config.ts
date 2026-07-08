import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-menu-config',
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
    templateUrl: './menu-config.html',
    styleUrl: './menu-config.scss',
})
export class MenuConfig {
    public vibrant: FormControl = new FormControl<boolean>(false);
    public overlapTrigger: FormControl = new FormControl<boolean>(false);
    public xPosition: FormControl = new FormControl<'start' | 'end' | 'before' | 'after'>('start');
    public yPosition: FormControl = new FormControl<'above' | 'below'>('below');
    public darkMode: FormControl = new FormControl<boolean>(true);
    public direction: FormControl = new FormControl<'ltr' | 'rtl'>('ltr');

    constructor(
        private sideSheetRef: SideSheetRef<MenuConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
