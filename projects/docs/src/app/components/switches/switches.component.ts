import { Component } from '@angular/core';
import { InputElement, Switch } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-switches.component',
    imports: [
        Switch,
        InputElement,
    ],
    templateUrl: './switches.component.html',
    styleUrl: './switches.component.scss',
})
export class SwitchesComponent {

}
