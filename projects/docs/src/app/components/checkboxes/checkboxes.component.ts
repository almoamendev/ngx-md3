import { Component } from '@angular/core';
import { Checkbox, InputElement } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-checkboxes',
    imports: [
        Checkbox,
        InputElement
    ],
    templateUrl: './checkboxes.component.html',
    styleUrl: './checkboxes.component.scss',
})
export class CheckboxesComponent {

}
