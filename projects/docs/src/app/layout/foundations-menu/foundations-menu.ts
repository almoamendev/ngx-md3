import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Divider, IconButton, IconElement, MaterialIcon, NavigationGroup, NavigationItem, SideSheetBody, SideSheetHeader, SideSheetRef } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-foundations-menu',
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
    templateUrl: './foundations-menu.html',
    styleUrl: './foundations-menu.scss',
})
export class FoundationsMenu {
    constructor(
        private sideSheetRef: SideSheetRef<FoundationsMenu>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
