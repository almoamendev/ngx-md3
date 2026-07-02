import { NgModule } from '@angular/core';
import { List } from './list';
import { ListItem } from './list-item/list-item';
import { ListSlot } from './list-slot';
import { ListLeading } from './list-leading/list-leading';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { IconButton } from '../buttons/icon-button/icon-button';
import { IconElement } from '../common/icon-element';
import { PrimaryAction } from './primary-action';



@NgModule({
    declarations: [
    ],
    imports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
        PrimaryAction,
        MaterialIcon,
        IconButton,
        IconElement,
    ],
    exports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
        MaterialIcon,
        IconButton,
        IconElement,
        PrimaryAction,
    ]
})
export class ListModule { }
