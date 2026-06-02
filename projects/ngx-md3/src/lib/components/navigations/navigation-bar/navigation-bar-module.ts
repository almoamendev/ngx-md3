import { NgModule } from '@angular/core';
import { NavigationBar } from './navigation-bar';
import { NavigationItem } from '../navigation-item/navigation-item';
import { IconElement } from '../../common/icon-element';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { Badge } from '../../common/badge';

@NgModule({
    declarations: [
        NavigationBar,
    ],
    imports: [
        NavigationItem,
        IconElement,
        MaterialIcon,
        Badge,
    ],
    exports: [
        NavigationBar,
        NavigationItem,
        IconElement,
        MaterialIcon,
        Badge,
    ],
})
export class NavigationBarModule { }
