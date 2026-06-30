import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, SliderSize, StateComponent, Switch, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-slider-config',
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
    templateUrl: './slider-config.html',
    styleUrl: './slider-config.scss',
})
export class SliderConfig {
    public showIcon: FormControl = new FormControl<boolean>(false);
    public sliderSize: FormControl = new FormControl<SliderSize>('x-small');
    public showValueLabel: FormControl = new FormControl<boolean>(false);
    public disable: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<SliderConfig>
    ) {
        this.showIcon.disable();
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
