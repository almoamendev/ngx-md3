import { NgModule } from '@angular/core';
import { TextField } from './text-field';
import { InputElement } from '../common/input-element';
import { IconElement } from '../common/icon-element';
import { SupportingText } from './supporting-text';
import { IconButton } from '../buttons/icon-button/icon-button';
import { NgClass } from '@angular/common';

@NgModule({
    declarations: [
        TextField,
        SupportingText,
    ],
    imports: [
        NgClass,
        InputElement,
        IconElement,
        IconButton,
    ],
    exports: [
        TextField,
        InputElement,
        SupportingText,
        IconElement,
        IconButton,
    ],
})
export class TextFieldModule { }
