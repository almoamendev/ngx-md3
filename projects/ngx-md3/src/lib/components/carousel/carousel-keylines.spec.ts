import { CarouselAlignment } from '../../types/carousel-alignment.type';
import { multiBrowseStrategy } from './carousel-arrangement';
import {
    buildGeometry,
    indexForScrollOffset,
    resolveItemGeometry,
    resolveState,
    scrollOffsetForIndex,
    sizeBandFor,
} from './carousel-keylines';

const CONTAINER = 800;
const ITEM_COUNT = 12;

function geometryFor(alignment: CarouselAlignment = 'start', itemCount = ITEM_COUNT) {
    const arrangement = multiBrowseStrategy.arrange({
        containerSize: CONTAINER,
        itemSize: 208,
        smallSizeMin: 48,
        smallSizeMax: 64,
        itemCount,
        alignment,
    });

    return {
        arrangement,
        geometry: buildGeometry(arrangement, alignment, itemCount, CONTAINER),
    };
}

describe('carousel keylines', () => {
    it('orders keylines along both axes', () => {
        const { geometry } = geometryFor();

        for (const step of geometry.steps) {
            for (let i = 1; i < step.keylines.length; i++) {
                expect(step.keylines[i].scrollLoc).toBeGreaterThan(step.keylines[i - 1].scrollLoc);
                expect(step.keylines[i].screenLoc).toBeGreaterThan(step.keylines[i - 1].screenLoc);
            }
        }
    });

    it('fills the container with the non-anchor keylines', () => {
        const { geometry } = geometryFor();

        for (const step of geometry.steps) {
            const filled = step.keylines
                .filter((keyline) => !keyline.isAnchor)
                .reduce((total, keyline) => total + keyline.maskedSize, 0);

            expect(filled).toBeCloseTo(CONTAINER, 1);
        }
    });

    it('gives every step the same number of keylines so states can be blended', () => {
        const { geometry } = geometryFor('center');
        const counts = new Set(geometry.steps.map((step) => step.keylines.length));

        expect(counts.size).toBe(1);
    });

    it('orders steps from the focal range at the start to the focal range at the end', () => {
        const { geometry } = geometryFor('center');

        expect(geometry.steps[0].focalStart).toBeCloseTo(0, 1);

        for (let i = 1; i < geometry.steps.length; i++) {
            expect(geometry.steps[i].focalStart).toBeGreaterThan(geometry.steps[i - 1].focalStart);
        }
    });

    it('rests the focal range at the start for start alignment', () => {
        const { geometry } = geometryFor('start');

        expect(geometry.steps[geometry.defaultStep].focalStart).toBeCloseTo(0, 1);
        expect(geometry.startShiftRange).toBeCloseTo(0, 1);
        expect(geometry.endShiftRange).toBeGreaterThan(0);
    });

    it('shifts at both ends for centre alignment', () => {
        const { geometry } = geometryFor('center');

        expect(geometry.startShiftRange).toBeGreaterThan(0);
        expect(geometry.endShiftRange).toBeGreaterThan(0);
    });

    it('leaves the first item fully unmasked at rest', () => {
        for (const alignment of ['start', 'center'] as CarouselAlignment[]) {
            const { geometry } = geometryFor(alignment);
            const state = resolveState(geometry, 0);
            const item = resolveItemGeometry(geometry, state, 0, 0);

            expect(item.maskedSize).toBeCloseTo(geometry.itemSize, 1);
            expect(item.maskRatio).toBeCloseTo(0, 2);
            expect(item.isFocal).toBeTrue();
        }
    });

    it('leaves the last item fully unmasked at the end of the scroll range', () => {
        for (const alignment of ['start', 'center'] as CarouselAlignment[]) {
            const { geometry } = geometryFor(alignment);
            const state = resolveState(geometry, geometry.maxScroll);
            const item = resolveItemGeometry(geometry, state, ITEM_COUNT - 1, geometry.maxScroll);

            expect(item.maskedSize).toBeCloseTo(geometry.itemSize, 1);
            expect(item.isFocal).toBeTrue();
            expect(item.offset + item.maskedSize).toBeLessThanOrEqual(CONTAINER + 1);
        }
    });

    it('keeps every visible item inside the container', () => {
        const { geometry } = geometryFor();

        for (let offset = 0; offset <= geometry.maxScroll; offset += 17) {
            const state = resolveState(geometry, offset);

            for (let index = 0; index < ITEM_COUNT; index++) {
                const item = resolveItemGeometry(geometry, state, index, offset);

                if (!item.isVisible) {
                    continue;
                }

                expect(item.offset).toBeGreaterThanOrEqual(-geometry.itemSize);
                expect(item.offset + item.maskedSize).toBeLessThanOrEqual(CONTAINER + geometry.itemSize);
            }
        }
    });

    it('never masks an item beyond its full size', () => {
        const { geometry } = geometryFor();

        for (let offset = 0; offset <= geometry.maxScroll; offset += 23) {
            const state = resolveState(geometry, offset);

            for (let index = 0; index < ITEM_COUNT; index++) {
                const item = resolveItemGeometry(geometry, state, index, offset);

                expect(item.maskedSize).toBeLessThanOrEqual(geometry.itemSize + 0.01);
                expect(item.maskRatio).toBeGreaterThanOrEqual(0);
                expect(item.maskRatio).toBeLessThanOrEqual(1);
            }
        }
    });

    it('brings each item into the focal range at its own snap offset', () => {
        const { geometry } = geometryFor();

        for (let index = 0; index <= geometry.lastIndex; index++) {
            const offset = scrollOffsetForIndex(geometry, index);
            const state = resolveState(geometry, offset);
            const item = resolveItemGeometry(geometry, state, index, offset);

            expect(item.maskedSize).toBeCloseTo(geometry.itemSize, 1);
            expect(item.isFocal).toBeTrue();
        }
    });

    it('stops the resting index short of the last item by the focal count', () => {
        const { arrangement, geometry } = geometryFor();

        expect(geometry.lastIndex).toBe(ITEM_COUNT - arrangement.largeCount);
    });

    it('moves the carousel for every index up to the last', () => {
        const { geometry } = geometryFor();
        const offsets = new Set<number>();

        for (let index = 0; index <= geometry.lastIndex; index++) {
            offsets.add(scrollOffsetForIndex(geometry, index));
        }

        // The reported bug was indices that resolved to the same offset, so advancing did
        // nothing visually. Every reachable index must own a distinct scroll position.
        expect(offsets.size).toBe(geometry.lastIndex + 1);
    });

    it('shows every trailing item once the last index is reached', () => {
        const { arrangement, geometry } = geometryFor();
        const offset = scrollOffsetForIndex(geometry, geometry.lastIndex);
        const state = resolveState(geometry, offset);

        for (let index = geometry.lastIndex; index < ITEM_COUNT; index++) {
            const item = resolveItemGeometry(geometry, state, index, offset);

            expect(item.maskedSize).toBeCloseTo(geometry.itemSize, 1);
            expect(item.isFocal).toBeTrue();
        }

        expect(ITEM_COUNT - geometry.lastIndex).toBe(arrangement.largeCount);
    });

    it('bands an item by the size it renders at', () => {
        const { arrangement, geometry } = geometryFor();

        expect(sizeBandFor(arrangement.largeSize, geometry)).toBe('large');
        expect(sizeBandFor(arrangement.mediumSize, geometry)).toBe('medium');
        expect(sizeBandFor(arrangement.smallSize, geometry)).toBe('small');
        expect(sizeBandFor(0, geometry)).toBe('small');
    });

    it('flips the band at the midpoint between two sizes', () => {
        const { arrangement, geometry } = geometryFor();
        const { largeSize, mediumSize, smallSize } = arrangement;

        expect(sizeBandFor((largeSize + mediumSize) / 2, geometry)).toBe('large');
        expect(sizeBandFor((largeSize + mediumSize) / 2 - 0.01, geometry)).toBe('medium');
        expect(sizeBandFor((mediumSize + smallSize) / 2, geometry)).toBe('medium');
        expect(sizeBandFor((mediumSize + smallSize) / 2 - 0.01, geometry)).toBe('small');
    });

    it('bands the resting items to match the arrangement', () => {
        const { arrangement, geometry } = geometryFor();
        const state = resolveState(geometry, 0);

        const bands = Array.from({ length: ITEM_COUNT }, (_, index) => {
            return resolveItemGeometry(geometry, state, index, 0);
        })
            .filter((item) => item.isVisible)
            .map((item) => item.size);

        // At rest the visible items are exactly the arrangement: the large run, then the
        // medium and small keylines.
        expect(bands.filter((band) => band === 'large').length).toBe(arrangement.largeCount);
        expect(bands.filter((band) => band === 'medium').length).toBe(arrangement.mediumCount);
    });

    it('bands a fully unmasked item as large, wherever it is', () => {
        const { geometry } = geometryFor();

        for (let offset = 0; offset <= geometry.maxScroll; offset += 19) {
            const state = resolveState(geometry, offset);

            for (let index = 0; index < ITEM_COUNT; index++) {
                const item = resolveItemGeometry(geometry, state, index, offset);

                if (item.isVisible && item.maskedSize >= geometry.itemSize - 0.5) {
                    expect(item.size).toBe('large');
                }
            }
        }
    });

    it('shrinks the band monotonically as an item crops away', () => {
        const { geometry } = geometryFor();
        const rank = { large: 2, medium: 1, small: 0 };

        for (let offset = 0; offset <= geometry.maxScroll; offset += 19) {
            const state = resolveState(geometry, offset);

            for (let index = 0; index < ITEM_COUNT; index++) {
                const a = resolveItemGeometry(geometry, state, index, offset);
                const b = resolveItemGeometry(geometry, state, index + 1, offset);

                // Later items are never rendered larger than earlier ones at rest positions
                // before the focal range, so their bands must not increase either.
                if (a.isVisible && b.isVisible && b.maskedSize < a.maskedSize) {
                    expect(rank[b.size]).toBeLessThanOrEqual(rank[a.size]);
                }
            }
        }
    });

    it('round-trips between index and scroll offset', () => {
        const { geometry } = geometryFor();

        for (let index = 0; index < ITEM_COUNT; index++) {
            const offset = scrollOffsetForIndex(geometry, index);
            const resolved = indexForScrollOffset(geometry, offset);

            expect(resolved).toBe(Math.min(index, geometry.lastIndex));
        }
    });

    it('clamps the scroll range to zero when every item already fits', () => {
        const { geometry } = geometryFor('start', 1);

        expect(geometry.maxScroll).toBe(0);
        expect(geometry.scrollSize).toBeCloseTo(CONTAINER, 1);
    });

    it('changes size continuously as the carousel scrolls', () => {
        const { geometry } = geometryFor();
        let previous: number | undefined;

        for (let offset = 0; offset <= geometry.maxScroll; offset += 4) {
            const state = resolveState(geometry, offset);
            const item = resolveItemGeometry(geometry, state, 3, offset);

            if (item.isVisible && previous !== undefined) {
                // A four pixel scroll must never jump an item by more than a few pixels.
                expect(Math.abs(item.maskedSize - previous)).toBeLessThan(12);
            }

            previous = item.isVisible ? item.maskedSize : undefined;
        }
    });
});
