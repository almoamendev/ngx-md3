import { Component } from '@angular/core';
import { Divider, List, ListItem, ListLeading, ListSlot, TypeBody } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-page-footer',
    imports: [
        Divider,
        TypeBody,
        List,
        ListItem,
        ListLeading,
        ListSlot,
    ],
    templateUrl: './page-footer.html',
    styleUrl: './page-footer.scss',
})
export class PageFooter {
}
