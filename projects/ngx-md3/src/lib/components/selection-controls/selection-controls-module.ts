import { NgModule } from '@angular/core';
import { Checkbox } from './checkbox/checkbox';
import { RadioButton } from './radio-button/radio-button';
import { Switch } from './switch/switch';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { IconElement } from '../common/icon-element';



@NgModule({
    declarations: [],
    imports: [
        Checkbox,
        RadioButton,
        Switch,
        InputElement,
        MaterialIcon,
        IconElement,
    ],
    exports: [
        Checkbox,
        RadioButton,
        Switch,
        InputElement,
        MaterialIcon,
        IconElement,
    ],
})
export class SelectionControlsModule { }
