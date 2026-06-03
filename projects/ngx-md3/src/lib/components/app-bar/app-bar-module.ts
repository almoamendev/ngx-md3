import { NgModule } from '@angular/core';
import { AppBar } from './app-bar';
import { IconButton } from '../buttons/icon-button/icon-button';
import { IconElement } from '../common/icon-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { TypeTitle } from '../../styles/typography/type-title';

@NgModule({
    declarations: [
        AppBar,
    ],
    imports: [
        IconButton,
        IconElement,
        MaterialIcon,
        TypeTitle,
    ],
    exports: [
        AppBar,
        IconButton,
        IconElement,
        MaterialIcon,
        TypeTitle,
    ],
})
export class AppBarModule { }
