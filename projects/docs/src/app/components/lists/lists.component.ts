import { Component } from '@angular/core';
import { Checkbox, Divider, IconButton, IconElement, InputElement, List, ListItem, ListLeading, ListSlot, MaterialIcon, PrimaryAction, RadioButton, TypeBody } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-lists',
    imports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
        PrimaryAction,
        MaterialIcon,
        IconButton,
        IconElement,
        Checkbox,
        RadioButton,
        InputElement,
        TypeBody,
        Divider,
    ],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.scss',
})
export class ListsComponent {
}
