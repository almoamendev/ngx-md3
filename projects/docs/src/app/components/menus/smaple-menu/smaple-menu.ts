import { Component, input } from '@angular/core';
import { Badge, Divider, IconElement, MaterialIcon, MenuGroup, MenuItem, MenuService } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-smaple-menu',
    imports: [
        MenuGroup,
        MenuItem,
        Divider,
        IconElement,
        MaterialIcon,
        Badge,
    ],
    templateUrl: './smaple-menu.html',
    styleUrl: './smaple-menu.scss',
})
export class SmapleMenu {
    public simple = input<boolean>(false);
    
    constructor(
        private menuService: MenuService
    ) {}

    public openSubMenu(
        event: MouseEvent,
    ) {
        const ref = this.menuService.openSubMenu(SmapleMenu, {
            data: {
                simple: true,
            },
            bindDataToInputs: true,
            origin: event,
        });

        ref.afterClosed().subscribe((result) => {
            console.log('Sub menu closed, results:: ', result);
        });
    }
}
