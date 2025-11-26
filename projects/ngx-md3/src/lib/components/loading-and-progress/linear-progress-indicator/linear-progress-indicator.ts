import { Component, Input } from '@angular/core';

@Component({
    selector: 'md3-linear-progress-indicator',
    imports: [],
    templateUrl: './linear-progress-indicator.html',
    styleUrl: './linear-progress-indicator.scss',
})
export class LinearProgressIndicator {
    @Input() indeterminate: boolean = false;
    @Input() thickness: number = 4;

    public get remThickness(): number {
        return Number((this.thickness / 16).toFixed(4));
    }
}
