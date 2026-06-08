import { Directive } from '@angular/core';
import { StateComponent } from './state-component';

@Directive({
    selector: '[md3-avatar]',
    hostDirectives: [
        StateComponent,
    ],
})
export class Avatar {
    constructor() { }
}
