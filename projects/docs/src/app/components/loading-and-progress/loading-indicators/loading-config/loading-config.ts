import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, SideSheetBody, SideSheetHeader, SideSheetRef, Slider, StateComponent, Switch, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-loading-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Switch,
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

    constructor(
        private sideSheetRef: SideSheetRef<LoadingConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
