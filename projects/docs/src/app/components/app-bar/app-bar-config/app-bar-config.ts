import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppBarScrollingStyle, AppBarType, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-app-bar-config',
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
    templateUrl: './app-bar-config.html',
    styleUrl: './app-bar-config.scss',
})
export class AppBarConfig {
    public barType: FormControl<AppBarType> = new FormControl<AppBarType>('small', { nonNullable: true });
    public scrollStyle: FormControl<AppBarScrollingStyle> = new FormControl<AppBarScrollingStyle>('elevate', { nonNullable: true });
    public autoHide: FormControl<boolean> = new FormControl<boolean>(false, { nonNullable: true });
    public centerAligned: FormControl<boolean> = new FormControl<boolean>(false, { nonNullable: true });

    constructor(
        private sideSheetRef: SideSheetRef<AppBarConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
