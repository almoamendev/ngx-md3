import { Component } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-checkbox',
    imports: [],
    templateUrl: './checkbox.html',
    styleUrl: './checkbox.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class Checkbox {

}
