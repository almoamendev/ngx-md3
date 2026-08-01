import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-scaffold-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Switch,
        InputElement,
        StateComponent,
        TypeLabel,
    ],
    templateUrl: './scaffold-config.html',
    styleUrl: './scaffold-config.scss',
})
export class ScaffoldConfig {
    public showTopBar: FormControl = new FormControl<boolean>(true);
    public showBottomBar: FormControl = new FormControl<boolean>(false);
    public showLeadingRail: FormControl = new FormControl<boolean>(true);
    public showTrailingRail: FormControl = new FormControl<boolean>(false);
    public showStartPane: FormControl = new FormControl<boolean>(false);
    public showEndPane: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<ScaffoldConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
