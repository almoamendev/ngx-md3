import { Component, effect, ElementRef, signal } from '@angular/core';
import { CarouselItemGeometry } from '../../../interfaces/carousel-keyline.interface';
import { CarouselItemSize } from '../../../types/carousel-item-size.type';

/**
 * A single item within an `md3-carousel`.
 *
 * The item is a clipping box whose content stays at full size, so scrolling crops the item
 * towards its centre rather than squashing it. Content should be full-bleed — an image or a
 * background that reaches the edges — or the crop will reveal empty space.
 *
 * Position and size are written straight to CSS custom properties by the parent carousel, so
 * styling never waits on change detection. The same values are mirrored onto signals and onto
 * `md3-large` / `md3-medium` / `md3-small` classes, so content can react to the item's size
 * either declaratively or from a stylesheet.
 */
@Component({
    selector: 'md3-carousel-item',
    templateUrl: './carousel-item.html',
    styleUrl: './carousel-item.scss',
    host: {
        'role': 'group',
        'aria-roledescription': 'slide',
    },
})
export class CarouselItem {
    /** 0 while the item is fully unmasked, approaching 1 as it crops away. */
    public readonly maskRatio = signal<number>(0);

    /** Current rendered size of the item, in pixels. */
    public readonly maskedSize = signal<number>(0);

    /** True while the item rests in the carousel's focal range. */
    public readonly isFocal = signal<boolean>(false);

    /**
     * Which of the arrangement's three sizes the item currently reads as.
     *
     * Mirrored onto the element as `md3-large`, `md3-medium` or `md3-small`.
     */
    public readonly size = signal<CarouselItemSize>('large');

    constructor(private el: ElementRef<HTMLElement>) {
        effect((onCleanup) => {
            const size = 'md3-' + this.size();
            this.element.classList.add(size);

            onCleanup(() => {
                this.element.classList.remove(size);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    /**
     * Applies a resolved placement.
     *
     * Called from the carousel's scroll handler on every frame, so this writes to the DOM
     * directly and only touches signals when a value actually changes.
     */
    public applyGeometry(geometry: CarouselItemGeometry, itemSize: number): void {
        const style = this.element.style;

        if (!geometry.isVisible) {
            this.element.setAttribute('hidden', '');
            return;
        }

        this.element.removeAttribute('hidden');
        style.setProperty('--md3-carousel-item-size', `${geometry.maskedSize}px`);
        style.setProperty('--md3-carousel-item-full-size', `${itemSize}px`);
        style.setProperty('--md3-carousel-item-offset', `${geometry.offset}px`);
        style.setProperty('--md3-carousel-item-mask-ratio', `${geometry.maskRatio}`);

        if (this.maskedSize() !== geometry.maskedSize) {
            this.maskedSize.set(geometry.maskedSize);
        }

        if (this.maskRatio() !== geometry.maskRatio) {
            this.maskRatio.set(geometry.maskRatio);
        }

        if (this.size() !== geometry.size) {
            this.size.set(geometry.size);
        }

        if (this.isFocal() !== geometry.isFocal) {
            this.isFocal.set(geometry.isFocal);
            this.element.classList.toggle('md3-focal', geometry.isFocal);
        }
    }
}
