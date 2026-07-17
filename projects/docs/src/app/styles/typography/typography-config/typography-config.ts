import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TextColor, TextSize, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

type TypeScale = 'display' | 'headline' | 'title' | 'body' | 'label';

@Component({
    selector: 'app-typography-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        RadioButton,
        Switch,
        InputElement,
        StateComponent,
        TypeLabel,
        TypeBody,
    ],
    templateUrl: './typography-config.html',
    styleUrl: './typography-config.scss',
})
export class TypographyConfig {
    public scale: FormControl = new FormControl<TypeScale>('display');
    public size: FormControl = new FormControl<TextSize>('large');
    public emphasized: FormControl = new FormControl<boolean>(false);
    public color: FormControl = new FormControl<TextColor | 'default'>('default');

    constructor(
        private sideSheetRef: SideSheetRef<TypographyConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
