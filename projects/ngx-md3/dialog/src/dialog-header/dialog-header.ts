import { Component } from '@angular/core';
import { TypeHeadline } from '@almoamendev/ngx-md3/typography';

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
