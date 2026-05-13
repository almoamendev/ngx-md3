import { Component } from '@angular/core';
import { Checkbox, InputElement, ListModule, TypeBody } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-lists.component',
    imports: [
        ListModule,
        Checkbox,
        InputElement,
        TypeBody,
    ],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.scss',
})
export class ListsComponent {
}
