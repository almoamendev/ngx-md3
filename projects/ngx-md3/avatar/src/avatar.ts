import { Directive } from '@angular/core';
import { StateComponent } from '@almoamendev/ngx-md3/core';

@Directive({
    selector: '[md3-avatar]',
    host: {
        'class': 'md3-avatar',
    },
    hostDirectives: [
        StateComponent,
    ],
})
export class Avatar {
    constructor() { }
}
