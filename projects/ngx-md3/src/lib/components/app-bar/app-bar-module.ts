import { NgModule } from '@angular/core';
import { AppBar } from './app-bar';
import { IconButton } from '../buttons/icon-button/icon-button';
import { IconElement } from '../common/icon-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { TypeTitle } from '../../styles/typography/type-title';
import { TypeBody } from '../../styles/typography/type-body';
import { TypeHeadline } from '../../styles/typography/type-headline';
import { TypeDisplay } from '../../styles/typography/type-display';
import { Avatar } from '../common/avatar';
import { AppBarLogo } from './app-bar-logo';

@NgModule({
    declarations: [
        AppBar,
        AppBarLogo,
    ],
    imports: [
        IconButton,
        IconElement,
        MaterialIcon,
        TypeTitle,
        TypeBody,
        TypeHeadline,
        TypeDisplay,
        Avatar,
    ],
    exports: [
        AppBar,
        AppBarLogo,
        IconButton,
        IconElement,
        MaterialIcon,
        Avatar,
    ],
})
export class AppBarModule { }
