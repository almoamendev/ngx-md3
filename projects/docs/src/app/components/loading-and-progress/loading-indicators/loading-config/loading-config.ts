import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, Slider, StateComponent, Switch, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-loading-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Switch,
        RadioButton,
        Slider,
        InputElement,
        StateComponent,
        TypeLabel,
    ],
    templateUrl: './loading-config.html',
    styleUrl: './loading-config.scss',
})
export class LoadingConfig {
    public contained: FormControl = new FormControl<boolean>(false);
    public size: FormControl = new FormControl<number>(48);
    public color: FormControl = new FormControl<'primary' | 'secondary' | 'tertiary'>('primary');

    constructor(
        private sideSheetRef: SideSheetRef<LoadingConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
