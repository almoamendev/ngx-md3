import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, InputElement, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-badge-config',
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
    templateUrl: './badge-config.html',
    styleUrl: './badge-config.scss',
})
export class BadgeConfig {
    public badgeType: FormControl = new FormControl<'dot' | 'count' | 'overflow' | 'text'>('dot');

    constructor(
        private sideSheetRef: SideSheetRef<BadgeConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
