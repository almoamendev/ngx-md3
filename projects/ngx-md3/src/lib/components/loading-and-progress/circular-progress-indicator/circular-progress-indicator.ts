import { Component, Input } from '@angular/core';

@Component({
    selector: 'md3-circular-progress-indicator',
    imports: [],
    templateUrl: './circular-progress-indicator.html',
    styleUrl: './circular-progress-indicator.scss',
})
export class CircularProgressIndicator {
    @Input() indeterminate: boolean = false;
    @Input() thickness: 4 | 8 = 4;
    @Input() progress: number = 0;

    constructor() {
        if (this.progress < 0) {
            this.progress = 0;
        }

        if (this.progress > 100) {
            this.progress = 100;
        }
    }
}
