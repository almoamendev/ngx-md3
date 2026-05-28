import { Component } from '@angular/core';
import { Button, IconButton, IconElement, MaterialIcon, SplitButton } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-split-buttons.component',
    imports: [
        SplitButton,
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './split-buttons.component.html',
    styleUrl: './split-buttons.component.scss',
})
export class SplitButtonsComponent {
}
