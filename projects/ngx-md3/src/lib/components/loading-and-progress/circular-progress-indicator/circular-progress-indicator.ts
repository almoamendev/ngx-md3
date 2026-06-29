import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'md3-circular-progress-indicator',
    imports: [],
    templateUrl: './circular-progress-indicator.html',
    styleUrl: './circular-progress-indicator.scss',
})
export class CircularProgressIndicator {
    public indeterminate = input<boolean>(false);
    public thickness = input<4 | 8>(4);
    public progress = input<number>(0);

    public progressValue = computed(() => {
        const progress = this.progress();
        if (progress < 0) {
            return 0;
        }

        if (progress > 100) {
            return 100;
        }

        return progress;
    });

    constructor() {
    }
}
