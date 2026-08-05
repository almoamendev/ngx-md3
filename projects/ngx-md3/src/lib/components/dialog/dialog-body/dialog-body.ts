import { Component } from '@angular/core';
import { TypeBody } from '../../../styles/typography/type-body';

@Component({
    selector: 'md3-dialog-body',
    imports: [
        TypeBody
    ],
    templateUrl: './dialog-body.html',
    styleUrl: './dialog-body.scss',
    host: {
        'class': 'md3-scrollable',
    },
})
export class DialogBody {
}
