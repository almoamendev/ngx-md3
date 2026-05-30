import { Component } from '@angular/core';
import { TypeHeadline } from '../../../styles/typography/type-headline';

@Component({
    selector: 'md3-dialog-header',
    imports: [
        TypeHeadline
    ],
    templateUrl: './dialog-header.html',
    styleUrl: './dialog-header.scss',
})
export class DialogHeader {
}
