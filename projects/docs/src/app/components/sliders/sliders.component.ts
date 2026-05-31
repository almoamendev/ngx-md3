import { Component } from '@angular/core';
import { Divider, IconElement, InputElement, MaterialIcon, Slider } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-sliders',
    imports: [
        Slider,
        InputElement,
        MaterialIcon,
        IconElement,
        Divider,
    ],
    templateUrl: './sliders.component.html',
    styleUrl: './sliders.component.scss',
})
export class SlidersComponent {
}
