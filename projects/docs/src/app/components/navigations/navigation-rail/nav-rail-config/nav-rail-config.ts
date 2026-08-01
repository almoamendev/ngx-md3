import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-nav-rail-config',
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
    templateUrl: './nav-rail-config.html',
    styleUrl: './nav-rail-config.scss',
})
export class NavRailConfig {
    public expanded: FormControl = new FormControl<boolean>(false);
    public hideMenuButton: FormControl = new FormControl<boolean>(false);
    public fullWidthIndicator: FormControl = new FormControl<boolean>(false);
    public containerStyle: FormControl = new FormControl<'none' | 'elevated' | 'divider'>('none');
    public collapsedLayout: FormControl = new FormControl<'compact' | 'narrow' | 'hidden'>('compact');
    public expandedLayout: FormControl = new FormControl<'standard' | 'modal'>('standard');
    public showFab: FormControl = new FormControl<boolean>(false);
    public badge: FormControl = new FormControl<'none' | 'dot' | 'count'>('none');

    constructor(
        private sideSheetRef: SideSheetRef<NavRailConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
