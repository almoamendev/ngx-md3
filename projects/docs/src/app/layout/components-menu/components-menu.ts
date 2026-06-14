import { Component } from '@angular/core';
import { IconButton, SideSheetHeader, IconElement, MaterialIcon, SideSheetRef } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-components-menu',
    imports: [
        SideSheetHeader,
        IconButton,
        IconElement,
        MaterialIcon,
    ],
    templateUrl: './components-menu.html',
    styleUrl: './components-menu.scss',
})
export class ComponentsMenu {
    constructor(
        private sideSheetRef: SideSheetRef<ComponentsMenu>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
