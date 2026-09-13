import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, ToolbarAlignment, ToolbarColor, ToolbarScrollAction, ToolbarType, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

/** `auto` lets the scaffold region pick the orientation. */
export type ToolbarOrientationChoice = 'horizontal' | 'vertical';

@Component({
    selector: 'app-toolbar-config',
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
    templateUrl: './toolbar-config.html',
    styleUrl: './toolbar-config.scss',
})
export class ToolbarConfig {
    public toolbarType: FormControl<ToolbarType> = new FormControl<ToolbarType>('floating', { nonNullable: true });
    public toolbarColor: FormControl<ToolbarColor> = new FormControl<ToolbarColor>('standard', { nonNullable: true });
    public orientation: FormControl<ToolbarOrientationChoice> = new FormControl<ToolbarOrientationChoice>('horizontal', { nonNullable: true });
    public alignment: FormControl<ToolbarAlignment> = new FormControl<ToolbarAlignment>('center', { nonNullable: true });
    public scrollAction: FormControl<ToolbarScrollAction> = new FormControl<ToolbarScrollAction>('none', { nonNullable: true });
    public fabPosition: FormControl<'start' | 'end'> = new FormControl<'start' | 'end'>('end', { nonNullable: true });
    public showFab: FormControl<boolean> = new FormControl<boolean>(false, { nonNullable: true });
    public persistentItem: FormControl<boolean> = new FormControl<boolean>(false, { nonNullable: true });

    public disableCollapse = signal<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<ToolbarConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
