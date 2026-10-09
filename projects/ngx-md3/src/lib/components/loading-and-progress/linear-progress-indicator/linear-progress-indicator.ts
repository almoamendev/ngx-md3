import { Component, computed, effect, ElementRef, input } from '@angular/core';

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
    public color = input<'primary' | 'secondary' | 'tertiary'>('primary');

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

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const color = 'md3-color-' + this.color();
            this.element.classList.add(color);

            onCleanup(() => {
                this.element.classList.remove(color);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
