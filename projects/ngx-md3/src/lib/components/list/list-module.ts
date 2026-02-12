import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from './list';
import { ListItem } from './list-item/list-item';
import { ListSlot } from './list-slot';
import { ListLeading } from './list-leading';



@NgModule({
    declarations: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
    ],
    imports: [
    ],
    exports: [
        List,
        ListItem,
        ListSlot,
        ListLeading,
    ]
})
export class ListModule { }
