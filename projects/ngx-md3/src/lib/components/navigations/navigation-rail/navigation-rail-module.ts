import { NgModule } from '@angular/core';
import { NavigationRail } from './navigation-rail';
import { IconButton } from '../../buttons/icon-button/icon-button';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { FloatingActionButton } from '../../buttons/floating-action-button/floating-action-button';
import { IconElement } from '../../common/icon-element';
import { NavigationItem } from '../navigation-item/navigation-item';
import { NavigationGroup } from '../navigation-group/navigation-group';
import { TypeLabel } from '../../../styles/typography/type-label';
import { Badge } from '../../common/badge';

@NgModule({
    declarations: [
        NavigationRail,
    ],
    imports: [
        NavigationGroup,
        NavigationItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
        TypeLabel,
        Badge,
    ],
    exports: [
        NavigationRail,
        NavigationGroup,
        NavigationItem,
        IconButton,
        IconElement,
        MaterialIcon,
        FloatingActionButton,
        Badge,
    ],
})
export class NavigationRailModule { }
