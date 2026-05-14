import { Component } from '@angular/core';
import { InputElement, Slider } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-sliders.component',
    imports: [
        Slider,
        InputElement,
    ],
    templateUrl: './sliders.component.html',
    styleUrl: './sliders.component.scss',
})
export class SlidersComponent {
}
