import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton, IconElement, MaterialIcon, NavigationGroup, NavigationItem, SideSheetBody, SideSheetHeader, SideSheetRef } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-styles-menu',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        IconElement,
        MaterialIcon,
        RouterLink,
        NavigationGroup,
        NavigationItem,
    ],
    templateUrl: './styles-menu.html',
    styleUrl: './styles-menu.scss',
})
export class StylesMenu {
    constructor(
        private sideSheetRef: SideSheetRef<StylesMenu>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
