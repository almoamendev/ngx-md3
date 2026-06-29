import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardType, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-card-config',
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
    templateUrl: './card-config.html',
    styleUrl: './card-config.scss',
})
export class CardConfig {
    public cardType: FormControl = new FormControl<CardType>('elevated');
    public interactive: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<CardConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
