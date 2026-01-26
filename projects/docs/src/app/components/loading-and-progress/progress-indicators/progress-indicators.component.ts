import { Component } from '@angular/core';
import { CircularProgressIndicator, LinearProgressIndicator } from "@vip9008/ngx-md3";

@Component({
    selector: 'app-progress-indicators',
    imports: [
        CircularProgressIndicator,
        LinearProgressIndicator
    ],
    templateUrl: './progress-indicators.component.html',
    styleUrl: './progress-indicators.component.scss',
})
export class ProgressIndicatorsComponent {

}
