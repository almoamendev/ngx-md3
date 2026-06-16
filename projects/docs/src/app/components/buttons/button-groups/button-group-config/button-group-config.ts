import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ButtonSize, Checkbox, IconButton, IconElement, InputElement, ListModule, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, TypeBody } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-button-group-config',
    imports: [
        SideSheetHeader,
        SideSheetBody,
        IconButton,
        MaterialIcon,
        IconElement,
        ListModule,
        Checkbox,
        RadioButton,
        InputElement,
        TypeBody
    ],
    templateUrl: './button-group-config.html',
    styleUrl: './button-group-config.scss',
})
export class ButtonGroupConfig {
    public buttonSize: FormControl = new FormControl<ButtonSize>('small');
    public isConntected: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<ButtonGroupConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
