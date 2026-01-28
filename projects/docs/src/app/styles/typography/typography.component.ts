import { Component } from '@angular/core';
import { TypeBody, TypeDisplay, TypeHeadline, TypeLabel, TypeTitle } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-typography',
    imports: [
        TypeDisplay,
        TypeHeadline,
        TypeTitle,
        TypeBody,
        TypeLabel,
    ],
    templateUrl: './typography.component.html',
    styleUrl: './typography.component.scss',
})
export class TypographyComponent {
}
