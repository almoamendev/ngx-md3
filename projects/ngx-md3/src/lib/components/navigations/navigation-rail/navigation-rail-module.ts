import { NgModule } from '@angular/core';
import { NavigationRail } from './navigation-rail';
import { IconButton } from '../../buttons/icon-button/icon-button';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { FloatingActionButton } from '../../buttons/floating-action-button/floating-action-button';
import { IconElement } from '../../common/icon-element';
import { NavigationItem } from '../navigation-item/navigation-item';

@NgModule({
    declarations: [
        NavigationRail,
    ],
    imports: [
        NavigationItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
    ],
    exports: [
        NavigationRail,
        NavigationItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
    ],
})
export class NavigationRailModule { }
