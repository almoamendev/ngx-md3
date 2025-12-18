import { NgModule } from '@angular/core';
import { TextField } from './text-field';
import { TextInput } from './text-input';
import { IconElement } from '../common/icon-element';
import { SupportingText } from './supporting-text';

@NgModule({
    declarations: [TextField, TextInput, SupportingText],
    imports: [IconElement],
    exports: [TextField, TextInput, SupportingText, IconElement],
})
export class TextFieldModule { }
