import { Component } from '@angular/core';
import { Button, ButtonGroup, IconButton, IconElement, MaterialIcon } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-button-groups.component',
    imports: [
        ButtonGroup,
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './button-groups.component.html',
    styleUrl: './button-groups.component.scss',
})
export class ButtonGroupsComponent {
}
