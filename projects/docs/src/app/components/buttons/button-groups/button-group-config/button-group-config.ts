import { Component } from '@angular/core';
import { IconButton, IconElement, MaterialIcon, SideSheetBody, SideSheetHeader, SideSheetRef } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-button-group-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './button-group-config.html',
    styleUrl: './button-group-config.scss',
})
export class ButtonGroupConfig {
    constructor(
        private sideSheetRef: SideSheetRef<ButtonGroupConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
