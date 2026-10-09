import { Component, computed, effect, ElementRef, input, Input } from '@angular/core';

@Component({
    selector: 'md3-loading-indicator',
    imports: [],
    templateUrl: './loading-indicator.html',
    styleUrl: './loading-indicator.scss',
})
export class LoadingIndicator {
    public contained = input<boolean>(false);
    public size = input<number>(48);
    public color = input<'primary' | 'secondary' | 'tertiary'>('primary');

    public dpSize = computed(() => {
        const fontSize = this.getHostFontSize();
        return Number((this.size() / fontSize).toFixed(4));
    });

    constructor(
        private el: ElementRef,
    ) {
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

    private getHostFontSize(): number {
        if (typeof getComputedStyle === 'undefined') {
            return 16;
        }

        return Number.parseFloat(getComputedStyle(this.element).fontSize) || 16;
    }
}
