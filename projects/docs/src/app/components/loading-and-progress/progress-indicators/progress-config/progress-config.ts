import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, Slider, StateComponent, Switch, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-progress-config',
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
    templateUrl: './progress-config.html',
    styleUrl: './progress-config.scss',
})
export class ProgressConfig {
    public indeterminate: FormControl = new FormControl<boolean>(false);
    public thickness: FormControl = new FormControl<4 | 8>(4);
    public progress: FormControl = new FormControl<number>(0);

    constructor(
        private sideSheetRef: SideSheetRef<ProgressConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
