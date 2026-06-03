import { Directive } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Directive({
    selector: 'label[md3-primary-action], button[md3-primary-action], a[md3-primary-action]',
    standalone: false,
    host: {
        tabindex: '0',
    },
    hostDirectives: [
        StateComponent
    ],
})
export class PrimaryAction {
}
