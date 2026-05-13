import { Component } from '@angular/core';
import { Checkbox, InputElement, ListModule, RadioButton, TypeBody } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-lists.component',
    imports: [
        ListModule,
        Checkbox,
        RadioButton,
        InputElement,
        TypeBody,
    ],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.scss',
})
export class ListsComponent {
}
