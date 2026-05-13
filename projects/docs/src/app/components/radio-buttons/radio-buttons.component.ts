import { Component } from '@angular/core';
import { InputElement, RadioButton } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-radio-buttons',
    imports: [
        RadioButton,
        InputElement
    ],
    templateUrl: './radio-buttons.component.html',
    styleUrl: './radio-buttons.component.scss',
})
export class RadioButtonsComponent {

}
