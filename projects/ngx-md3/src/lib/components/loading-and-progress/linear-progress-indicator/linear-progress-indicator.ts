import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'md3-linear-progress-indicator',
    imports: [],
    templateUrl: './linear-progress-indicator.html',
    styleUrl: './linear-progress-indicator.scss',
})
export class LinearProgressIndicator {
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
