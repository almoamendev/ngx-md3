import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FabSize, FabType, IconButton, IconElement, InputElement, MaterialIcon, RadioButton, SideSheetBody, SideSheetHeader, SideSheetRef, StateComponent, Switch, TypeBody, TypeLabel } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-fabs-config',
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
    templateUrl: './fabs-config.html',
    styleUrl: './fabs-config.scss',
})
export class FabsConfig {
    public showIcon: FormControl = new FormControl<boolean>(true);
    public buttonSize: FormControl = new FormControl<FabSize>('small');
    public buttonType: FormControl = new FormControl<FabType>('tonal-primary');
    public isExtended: FormControl = new FormControl<boolean>(false);

    constructor(
        private sideSheetRef: SideSheetRef<FabsConfig>
    ) {
    }

    public close(): void {
        this.sideSheetRef.close();
    }
}
