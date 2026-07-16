import { Component } from '@angular/core';
import { MaterialIcon, TextField, InputElement, SupportingText, IconElement, IconButton } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-text-fields',
    imports: [
        TextField,
        InputElement,
        SupportingText,
        IconElement,
        IconButton,
        MaterialIcon
    ],
    templateUrl: './text-fields.component.html',
    styleUrl: './text-fields.component.scss',
})
export class TextFieldsComponent {
}
