import { Component } from '@angular/core';
import { Button, IconElement, MaterialIcon } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-buttons',
    imports: [
        Button,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './buttons.component.html',
    styleUrl: './buttons.component.scss',
})
export class ButtonsComponent {

}
