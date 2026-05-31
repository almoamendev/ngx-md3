import { Component } from '@angular/core';
import { Button, IconButton, IconElement, MaterialIcon, MenuService, SplitButton } from '@vip9008/ngx-md3';
import { SmapleMenu } from '../../menus/smaple-menu/smaple-menu';

@Component({
    selector: 'app-split-buttons',
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
    constructor(
        private menuService: MenuService
    ) {}

    public openMenu(
        event: MouseEvent,
    ) {
        this.menuService.open(SmapleMenu, {
            data: {
                simple: true,
            },
            bindDataToInputs: true,
            xPosition: 'end',
            yPosition: 'below',
            origin: event,
        });
    }
}
