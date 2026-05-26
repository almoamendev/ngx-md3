import { Component } from '@angular/core';
import { Button, MenuService } from '@vip9008/ngx-md3';
import { SmapleMenu } from './smaple-menu/smaple-menu';

@Component({
    selector: 'app-menus',
    imports: [
        Button,
    ],
    templateUrl: './menus.component.html',
    styleUrl: './menus.component.scss',
})
export class MenusComponent {
    constructor(
        private menuService: MenuService
    ) {}

    public sampleMenu(
        event: MouseEvent,
        vibrant: boolean = false,
        xPosition: 'start' | 'end' | 'before' | 'after' = 'start',
        yPosition: 'above' | 'below' = 'below',
    ) {
        const ref = this.menuService.open(SmapleMenu, {
            origin: event,
            xPosition,
            yPosition,
            menuColors: vibrant ? 'vibrant' : 'standard',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('Menu closed, results:: ', result);
        });
    }
}
