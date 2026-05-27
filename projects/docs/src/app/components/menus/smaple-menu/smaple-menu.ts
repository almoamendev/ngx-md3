import { Component, Input } from '@angular/core';
import { Badge, IconElement, MaterialIcon, MenuGroup, MenuItem, MenuService, TypeBody, TypeLabel, TypeTitle } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-smaple-menu',
    imports: [
        IconElement,
        MaterialIcon,
        MenuGroup,
        MenuItem,
        TypeLabel,
        TypeBody,
        TypeTitle,
        Badge,
    ],
    templateUrl: './smaple-menu.html',
    styleUrl: './smaple-menu.scss',
})
export class SmapleMenu {
    @Input() simple: boolean = false;
    
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
