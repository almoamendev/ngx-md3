import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton, SideSheetHeader, IconElement, MaterialIcon, SideSheetRef, NavigationGroup, NavigationItem, Divider, SideSheetBody } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-components-menu',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        IconElement,
        MaterialIcon,
        RouterLink,
        NavigationGroup,
        NavigationItem,
        Divider,
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
