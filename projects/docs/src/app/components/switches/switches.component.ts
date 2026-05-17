import { Component } from '@angular/core';
import { IconElement, InputElement, MaterialIcon, Switch } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-switches.component',
    imports: [
        Switch,
        InputElement,
        MaterialIcon,
        IconElement,
    ],
    templateUrl: './switches.component.html',
    styleUrl: './switches.component.scss',
})
export class SwitchesComponent {

}
