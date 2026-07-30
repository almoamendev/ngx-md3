import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, IconElement, MaterialIcon, TypeBody, TypeDisplay } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-error',
    imports: [
        RouterLink,
        Button,
        MaterialIcon,
        IconElement,
        TypeDisplay,
        TypeBody,
    ],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
})
export class ErrorComponent {
}
