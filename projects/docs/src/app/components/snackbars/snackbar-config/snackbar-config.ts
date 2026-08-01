import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-snackbar-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        Switch,
        RadioButton,
        InputElement,
        StateComponent,
        TypeBody,
        TypeLabel,
    ],
    templateUrl: './snackbar-config.html',
    styleUrl: './snackbar-config.scss',
})
export class SnackbarConfig {
    public showCloseIcon: FormControl = new FormControl<boolean>(false);
    public stackedAction: FormControl = new FormControl<boolean>(false);
    public replaceCurrent: FormControl = new FormControl<boolean>(false);
    public duration: FormControl = new FormControl<string>('4000');
    public politeness: FormControl = new FormControl<'polite' | 'assertive'>('polite');
    public scheme: FormControl = new FormControl<'inherit' | 'light' | 'dark'>('inherit');
    public direction: FormControl = new FormControl<'ltr' | 'rtl'>('ltr');
    public position: FormControl = new FormControl<'start' | 'center' | 'end'>('start');
    public bottomOffset: FormControl = new FormControl<string>('0');

    constructor(
        private sideSheetRef: SideSheetRef<SnackbarConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
