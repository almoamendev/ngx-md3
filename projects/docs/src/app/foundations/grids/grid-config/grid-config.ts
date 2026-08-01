import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, ListItem, ListSlot, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-grid-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        ListItem,
        ListSlot,
        MaterialIcon,
        IconButton,
        IconElement,
        RadioButton,
        InputElement,
        MaterialIcon,
        TypeBody,
    ],
    templateUrl: './grid-config.html',
    styleUrl: './grid-config.scss',
})
export class GridConfig {
    public columns: FormControl<string> = new FormControl<string>('auto', { nonNullable: true });

    constructor(
        private sideSheetRef: SideSheetRef<GridConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
