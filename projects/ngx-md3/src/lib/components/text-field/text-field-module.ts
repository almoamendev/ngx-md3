import { NgModule } from '@angular/core';
import { TextField } from './text-field';
import { TextInput } from './text-input';
import { IconElement } from '../common/icon-element';
import { SupportingText } from './supporting-text';
import { IconButton } from '../buttons/icon-button/icon-button';
import { NgClass } from '@angular/common';

@NgModule({
    declarations: [TextField, TextInput, SupportingText],
    imports: [NgClass, IconElement, IconButton],
    exports: [TextField, TextInput, SupportingText, IconElement, IconButton],
})
export class TextFieldModule { }
