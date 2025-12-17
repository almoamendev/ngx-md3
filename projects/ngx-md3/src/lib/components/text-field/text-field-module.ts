import { NgModule } from '@angular/core';
import { TextField } from './text-field';
import { TextInput } from './text-input';
import { IconElement } from '../common/icon-element';

@NgModule({
    declarations: [TextField, TextInput],
    imports: [IconElement],
    exports: [TextField, TextInput, IconElement],
})
export class TextFieldModule { }
