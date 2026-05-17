import { NgModule } from '@angular/core';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { IconElement } from '../../common/icon-element';
import { ButtonGroup } from './button-group';

@NgModule({
    declarations: [
        ButtonGroup,
    ],
    imports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
    ],
    exports: [
        Button,
        IconButton,
        MaterialIcon,
        IconElement,
        ButtonGroup,
    ],
})
export class ButtonGroupModule { }
