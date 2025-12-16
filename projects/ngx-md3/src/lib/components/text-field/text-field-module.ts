import { NgModule } from '@angular/core';
import { TextField } from './text-field';
import { TextInput } from './text-input';

@NgModule({
    declarations: [TextField, TextInput],
    exports: [TextField, TextInput],
})
export class TextFieldModule { }
