import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Carousel, parseCarouselAspectRatio } from './carousel';
import { CarouselItem } from './carousel-item/carousel-item';

@Component({
    imports: [Carousel, CarouselItem],
    template: `
        <md3-carousel [(index)]="index" [item-size]="200" [aspect-ratio]="ratio()"
            style="width: 800px;">
            @for (item of items(); track item) {
                <md3-carousel-item>
                    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" [alt]="'item ' + item" />
                </md3-carousel-item>
            }
        </md3-carousel>
    `,
})
class CarouselHost {
    public readonly items = signal<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
    public readonly index = signal<number>(0);
    public readonly ratio = signal<string | undefined>(undefined);
    public readonly carousel = viewChild.required(Carousel);
}

describe('parseCarouselAspectRatio', () => {
    it('reads numbers and fractions', () => {
        expect(parseCarouselAspectRatio(1.5)).toBe(1.5);
        expect(parseCarouselAspectRatio('1.5')).toBe(1.5);
        expect(parseCarouselAspectRatio('16/9')).toBeCloseTo(16 / 9, 6);
        expect(parseCarouselAspectRatio(' 16 / 9 ')).toBeCloseTo(16 / 9, 6);
        expect(parseCarouselAspectRatio('1/1')).toBe(1);
    });

    it('falls back to undefined for anything unusable', () => {
        expect(parseCarouselAspectRatio(undefined)).toBeUndefined();
        expect(parseCarouselAspectRatio(null)).toBeUndefined();
        expect(parseCarouselAspectRatio('')).toBeUndefined();
        expect(parseCarouselAspectRatio(0)).toBeUndefined();
        expect(parseCarouselAspectRatio(-2)).toBeUndefined();
        expect(parseCarouselAspectRatio('16/0')).toBeUndefined();
        expect(parseCarouselAspectRatio('wide')).toBeUndefined();
    });
});

describe('Carousel', () => {
    let fixture: ComponentFixture<CarouselHost>;
    let host: CarouselHost;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarouselHost],
        }).compileComponents();

        fixture = TestBed.createComponent(CarouselHost);
        host = fixture.componentInstance;

        await settle();
    });

    /**
     * The carousel measures itself after render, and placing items depends on that measurement,
     * so a single change detection pass is not enough to reach a steady state.
     */
    async function settle(): Promise<void> {
        for (let pass = 0; pass < 3; pass++) {
            fixture.detectChanges();
            await fixture.whenStable();
        }
    }

    /**
     * Waits for a DOM resize to be picked up.
     *
     * `ResizeObserver` delivers asynchronously and is not something `whenStable` tracks, so a
     * fixed number of change detection passes can return before the carousel has re-measured.
     */
    async function settleResize(until: () => boolean): Promise<void> {
        for (let attempt = 0; attempt < 50; attempt++) {
            fixture.detectChanges();
            await fixture.whenStable();

            if (until()) {
                return;
            }

            await new Promise<void>((resolve) => setTimeout(resolve, 10));
        }

        throw new Error('Timed out waiting for the carousel to re-measure after a resize');
    }

    it('creates', () => {
        expect(host.carousel()).toBeTruthy();
    });

    it('projects every item', () => {
        expect(host.carousel().items().length).toBe(8);
    });

    it('solves an arrangement once measured', () => {
        const arrangement = host.carousel().arrangement();

        expect(arrangement).toBeTruthy();
        expect(arrangement!.largeCount).toBeGreaterThanOrEqual(1);
        expect(arrangement!.largeSize).toBeGreaterThan(0);
    });

    it('marks the carousel for assistive technology', () => {
        const element = fixture.nativeElement.querySelector('md3-carousel') as HTMLElement;

        expect(element.getAttribute('role')).toBe('group');
        expect(element.getAttribute('aria-roledescription')).toBe('carousel');
    });

    it('labels each item with its position', () => {
        const first = fixture.nativeElement.querySelector('md3-carousel-item') as HTMLElement;

        expect(first.getAttribute('aria-roledescription')).toBe('slide');
        expect(first.getAttribute('aria-label')).toBe('1 of 8');
    });

    it('reports its position in the list', () => {
        expect(host.carousel().atStart()).toBeTrue();
        expect(host.carousel().atEnd()).toBeFalse();
    });

    it('stops short of the last item, since the trailing items share the focal range', () => {
        const carousel = host.carousel();

        expect(carousel.lastIndex()).toBeGreaterThan(0);
        expect(carousel.lastIndex()).toBe(8 - carousel.arrangement()!.largeCount);
    });

    it('advances and retreats without leaving the list', () => {
        const carousel = host.carousel();

        carousel.previous();
        expect(carousel.index()).toBe(0);

        carousel.next();
        expect(carousel.index()).toBe(1);

        carousel.scrollToIndex(999);
        expect(carousel.index()).toBe(carousel.lastIndex());
        expect(carousel.atEnd()).toBeTrue();

        carousel.next();
        expect(carousel.index()).toBe(carousel.lastIndex());
    });

    it('moves the carousel on every advance up to the end', () => {
        const carousel = host.carousel();
        const seen = new Set<number>();

        carousel.scrollToIndex(0, 'auto');

        while (!carousel.atEnd()) {
            const before = carousel.index();

            carousel.next();

            // Each advance must reach a position the carousel has not already been resting at,
            // otherwise pressing "next" does nothing visible.
            expect(carousel.index()).toBeGreaterThan(before);
            expect(seen.has(carousel.index())).toBeFalse();

            seen.add(carousel.index());
        }

        expect(carousel.index()).toBe(carousel.lastIndex());
    });

    it('retreats immediately from the end', () => {
        const carousel = host.carousel();

        carousel.scrollToIndex(999, 'auto');
        carousel.previous();

        expect(carousel.index()).toBe(carousel.lastIndex() - 1);
    });

    it('writes the index back to a two-way binding', () => {
        host.carousel().scrollToIndex(3);

        expect(host.index()).toBe(3);
    });

    it('re-solves when items are added', async () => {
        const before = host.carousel().geometry()!.maxScroll;

        host.items.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        await settle();

        expect(host.carousel().geometry()!.maxScroll).toBeGreaterThan(before);
    });

    it('survives an empty list', async () => {
        host.items.set([]);
        await settle();

        expect(host.carousel().arrangement()).toBeUndefined();
        expect(host.carousel().items().length).toBe(0);
    });

    it('gives every item a size and an offset', () => {
        const items = fixture.nativeElement.querySelectorAll('md3-carousel-item') as NodeListOf<HTMLElement>;
        const visible = Array.from(items).filter((item) => !item.hasAttribute('hidden'));

        expect(visible.length).toBeGreaterThan(0);

        for (const item of visible) {
            expect(item.style.getPropertyValue('--md3-carousel-item-size')).toMatch(/px$/);
            expect(item.style.getPropertyValue('--md3-carousel-item-offset')).toMatch(/px$/);
        }
    });

    it('keeps the first items unmasked at rest', () => {
        expect(host.carousel().items()[0].maskRatio()).toBeCloseTo(0, 2);
        expect(host.carousel().items()[0].isFocal()).toBeTrue();
    });

    it('leaves the height to CSS when no ratio is set', () => {
        const element = fixture.nativeElement.querySelector('md3-carousel') as HTMLElement;

        expect(host.carousel().resolvedHeight()).toBeUndefined();
        expect(element.style.getPropertyValue('--md3-carousel-aspect-height')).toBe('');
    });

    it('derives the height from the solved item width for a ratio', async () => {
        host.ratio.set('16 / 9');
        await settle();

        const carousel = host.carousel();
        const width = carousel.geometry()!.itemSize - 8;

        expect(carousel.resolvedHeight()).toBeCloseTo(width / (16 / 9), 3);
    });

    it('keeps the ratio when the container resizes', async () => {
        host.ratio.set('16 / 9');
        await settle();

        const carousel = host.carousel();
        const element = fixture.nativeElement.querySelector('md3-carousel') as HTMLElement;
        const beforeWidth = carousel.geometry()!.itemSize;
        const beforeHeight = carousel.resolvedHeight()!;

        element.style.width = '520px';
        await settleResize(() => carousel.geometry()!.itemSize !== beforeWidth);

        const afterWidth = carousel.geometry()!.itemSize;
        const afterHeight = carousel.resolvedHeight()!;

        // Both dimensions have to move for this to prove anything...
        expect(afterWidth).not.toBeCloseTo(beforeWidth, 1);
        expect(afterHeight).not.toBeCloseTo(beforeHeight, 1);

        // ...and the shape they describe must not.
        expect((afterWidth - 8) / afterHeight).toBeCloseTo((beforeWidth - 8) / beforeHeight, 3);
    });

    it('restores the CSS height when the ratio is removed', async () => {
        host.ratio.set('16 / 9');
        await settle();

        host.ratio.set(undefined);
        await settle();

        const element = fixture.nativeElement.querySelector('md3-carousel') as HTMLElement;

        expect(element.style.getPropertyValue('--md3-carousel-aspect-height')).toBe('');
    });

    it('classes each item with the size it renders at', () => {
        const carousel = host.carousel();
        const arrangement = carousel.arrangement()!;
        const elements = Array.from(
            fixture.nativeElement.querySelectorAll('md3-carousel-item') as NodeListOf<HTMLElement>,
        );

        const visible = elements.filter((element) => !element.hasAttribute('hidden'));
        const large = visible.filter((element) => element.classList.contains('md3-large'));

        expect(large.length).toBe(arrangement.largeCount);
        expect(carousel.items()[0].size()).toBe('large');

        // Exactly one size class at a time.
        for (const element of visible) {
            const classes = ['md3-large', 'md3-medium', 'md3-small']
                .filter((name) => element.classList.contains(name));

            expect(classes.length).toBe(1);
        }
    });
});
