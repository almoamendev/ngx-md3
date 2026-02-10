import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from './list';
import { ListItem } from './list-item/list-item';
import { ListSlot } from './list-slot';



@NgModule({
    declarations: [
        List,
        ListItem,
        ListSlot,
    ],
    imports: [
    ],
    exports: [
        List,
        ListItem,
        ListSlot,
    ]
})
export class ListModule { }
