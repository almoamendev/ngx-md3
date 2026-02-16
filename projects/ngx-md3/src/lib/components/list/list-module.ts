import { NgModule } from '@angular/core';
import { List } from './list';
import { ListItem } from './list-item/list-item';
import { ListSlot } from './list-slot';
import { ListLeading } from './list-leading/list-leading';
import { MaterialIcon } from '../common/material-icon/material-icon';



@NgModule({
    declarations: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
    ],
    imports: [
        MaterialIcon,
    ],
    exports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
        MaterialIcon,
    ]
})
export class ListModule { }
