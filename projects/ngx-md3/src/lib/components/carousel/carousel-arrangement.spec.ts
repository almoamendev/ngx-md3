import { CarouselStrategyContext } from '../../interfaces/carousel-strategy.interface';
import { multiBrowseStrategy } from './carousel-arrangement';

function context(overrides: Partial<CarouselStrategyContext> = {}): CarouselStrategyContext {
    return {
        containerSize: 800,
        itemSize: 208,
        smallSizeMin: 48,
        smallSizeMax: 64,
        itemCount: 12,
        alignment: 'start',
        ...overrides,
    };
}

function totalSize(arrangement: ReturnType<typeof multiBrowseStrategy.arrange>): number {
    return arrangement.largeSize * arrangement.largeCount
        + arrangement.mediumSize * arrangement.mediumCount
        + arrangement.smallSize * arrangement.smallCount;
}

describe('multiBrowseStrategy', () => {
    it('fills the container exactly', () => {
        for (let containerSize = 240; containerSize <= 2000; containerSize += 37) {
            const arrangement = multiBrowseStrategy.arrange(context({ containerSize }));

            expect(totalSize(arrangement)).toBeCloseTo(containerSize, 1);
        }
    });

    it('keeps large items larger than medium, and medium larger than small', () => {
        for (let containerSize = 320; containerSize <= 2000; containerSize += 53) {
            const arrangement = multiBrowseStrategy.arrange(context({ containerSize }));

            if (arrangement.mediumCount > 0) {
                expect(arrangement.largeSize).toBeGreaterThan(arrangement.mediumSize);
            }

            if (arrangement.smallCount > 0 && arrangement.mediumCount > 0) {
                expect(arrangement.mediumSize).toBeGreaterThan(arrangement.smallSize);
            }
        }
    });

    it('holds the small item within its allowed range', () => {
        for (let containerSize = 320; containerSize <= 2000; containerSize += 61) {
            const arrangement = multiBrowseStrategy.arrange(context({ containerSize }));

            if (arrangement.smallCount > 0) {
                expect(arrangement.smallSize).toBeGreaterThanOrEqual(48 - 0.01);
                expect(arrangement.smallSize).toBeLessThanOrEqual(64 + 0.01);
            }
        }
    });

    it('stays close to the requested item size', () => {
        const arrangement = multiBrowseStrategy.arrange(context({ containerSize: 800, itemSize: 208 }));

        expect(arrangement.largeSize).toBeGreaterThan(150);
        expect(arrangement.largeSize).toBeLessThan(280);
    });

    it('always leaves a hint that the list continues', () => {
        const arrangement = multiBrowseStrategy.arrange(context({ containerSize: 900, itemSize: 900 }));

        expect(arrangement.mediumCount + arrangement.smallCount).toBeGreaterThan(0);
    });

    it('sheds keylines for a short list, small items first', () => {
        for (let itemCount = 1; itemCount <= 6; itemCount++) {
            const arrangement = multiBrowseStrategy.arrange(context({ itemCount }));
            const keylines = arrangement.largeCount + arrangement.mediumCount + arrangement.smallCount;

            // Large items are never dropped, and one medium is always kept so the arrangement
            // still reads as a carousel, so this is the tightest guarantee available.
            expect(keylines).toBeLessThanOrEqual(Math.max(itemCount, arrangement.largeCount + 1));

            // Small items go before medium ones.
            if (arrangement.smallCount > 0) {
                expect(keylines).toBeLessThanOrEqual(itemCount);
            }
        }
    });

    it('doubles the surrounding keylines when centre aligned', () => {
        const start = multiBrowseStrategy.arrange(context({ alignment: 'start' }));
        const center = multiBrowseStrategy.arrange(context({ alignment: 'center' }));

        expect(center.smallCount + center.mediumCount)
            .toBeGreaterThan(start.smallCount + start.mediumCount);
        expect(center.smallCount % 2).toBe(0);
        expect(center.mediumCount % 2).toBe(0);
    });

    it('drops small items when the container is too narrow for them', () => {
        const arrangement = multiBrowseStrategy.arrange(context({ containerSize: 90, smallSizeMin: 48 }));

        expect(arrangement.smallCount).toBe(0);
        expect(arrangement.largeCount).toBeGreaterThanOrEqual(1);
    });

    it('returns a usable arrangement for a single item', () => {
        const arrangement = multiBrowseStrategy.arrange(context({ itemCount: 1 }));

        expect(arrangement.largeCount).toBeGreaterThanOrEqual(1);
        expect(arrangement.largeSize).toBeGreaterThan(0);
    });
});
