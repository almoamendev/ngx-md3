import { Component } from '@angular/core';
import { TextFieldModule, MaterialIcon } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-text-fields',
    imports: [
        TextFieldModule,
        MaterialIcon
    ],
    templateUrl: './text-fields.component.html',
    styleUrl: './text-fields.component.scss',
})
export class TextFieldsComponent {

}
