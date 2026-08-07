import { CarouselArrangement } from '../../interfaces/carousel-arrangement.interface';
import { CarouselStrategy, CarouselStrategyContext } from '../../interfaces/carousel-strategy.interface';
import { CarouselLayout } from '../../types/carousel-layout.type';

/** Fraction of its own size a medium item may flex by to protect the large item's target size. */
const MEDIUM_FLEX = 0.1;

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * One candidate distribution, already fitted to the container.
 *
 * `cost` ranks candidates: lower is better. A candidate that cannot preserve the
 * large > medium > small ordering is invalid and never selected.
 */
interface Candidate extends CarouselArrangement {
    cost: number;
}

/**
 * Solves for the large item size given that medium items are always the mean of large and small.
 *
 * containerSize = largeSize * largeCount
 *               + ((largeSize + smallSize) / 2) * mediumCount
 *               + smallSize * smallCount
 */
function solveLargeSize(
    containerSize: number,
    smallSize: number,
    smallCount: number,
    mediumCount: number,
    largeCount: number,
): number {
    const smallContribution = (smallCount + mediumCount / 2) * smallSize;
    return (containerSize - smallContribution) / (largeCount + mediumCount / 2);
}

/**
 * Shrinks or grows a candidate until it exactly fills the container, disturbing the large items
 * as little as possible: small items absorb the difference first, then medium items flex, and
 * only what is left over changes the large size.
 */
function fit(
    containerSize: number,
    targetLargeSize: number,
    smallSizeMin: number,
    smallSizeMax: number,
    smallCount: number,
    mediumCount: number,
    largeCount: number,
    targetSmallSize: number,
    priority: number,
): Candidate {
    let smallSize = clamp(targetSmallSize, smallSizeMin, smallSizeMax);
    let largeSize = targetLargeSize;
    let mediumSize = (targetLargeSize + smallSize) / 2;

    const occupied = largeSize * largeCount + mediumSize * mediumCount + smallSize * smallCount;
    const delta = containerSize - occupied;

    if (smallCount > 0 && delta > 0) {
        smallSize += Math.min(delta / smallCount, smallSizeMax - smallSize);
    } else if (smallCount > 0 && delta < 0) {
        smallSize += Math.max(delta / smallCount, smallSizeMin - smallSize);
    }

    if (smallCount === 0) {
        smallSize = 0;
    }

    largeSize = solveLargeSize(containerSize, smallSize, smallCount, mediumCount, largeCount);
    mediumSize = (largeSize + smallSize) / 2;

    // Give the large items back as much of their target size as the medium items can spare.
    if (mediumCount > 0 && largeSize !== targetLargeSize) {
        const targetAdjustment = (targetLargeSize - largeSize) * largeCount;
        const availableFlex = mediumSize * MEDIUM_FLEX * mediumCount;
        const distribute = Math.min(Math.abs(targetAdjustment), availableFlex);
        const direction = targetAdjustment > 0 ? 1 : -1;

        mediumSize -= (direction * distribute) / mediumCount;
        largeSize += (direction * distribute) / largeCount;
    }

    return {
        largeSize,
        largeCount,
        mediumSize,
        mediumCount,
        smallSize,
        smallCount,
        cost: cost(targetLargeSize, largeSize, mediumSize, smallSize, largeCount, mediumCount, smallCount, priority),
    };
}

function isValid(
    largeSize: number,
    mediumSize: number,
    smallSize: number,
    largeCount: number,
    mediumCount: number,
    smallCount: number,
): boolean {
    if (largeSize <= 0) {
        return false;
    }

    if (largeCount > 0 && smallCount > 0 && mediumCount > 0) {
        return largeSize > mediumSize && mediumSize > smallSize;
    }

    if (largeCount > 0 && smallCount > 0) {
        return largeSize > smallSize;
    }

    return true;
}

function cost(
    targetLargeSize: number,
    largeSize: number,
    mediumSize: number,
    smallSize: number,
    largeCount: number,
    mediumCount: number,
    smallCount: number,
    priority: number,
): number {
    if (!isValid(largeSize, mediumSize, smallSize, largeCount, mediumCount, smallCount)) {
        return Number.POSITIVE_INFINITY;
    }

    // Prefer arrangements that appear earlier in the priority order and that leave the large
    // item closest to the size the consumer asked for.
    return Math.abs(targetLargeSize - largeSize) * priority;
}

/**
 * Fits every permutation of the supplied counts and returns the cheapest.
 *
 * Permutations are generated in priority order, so a zero-cost candidate is provably optimal
 * and ends the search early.
 */
function findLowestCostArrangement(
    containerSize: number,
    targetLargeSize: number,
    targetSmallSize: number,
    smallSizeMin: number,
    smallSizeMax: number,
    smallCounts: number[],
    mediumCounts: number[],
    largeCounts: number[],
): Candidate {
    let best: Candidate | undefined;
    let priority = 1;

    for (const largeCount of largeCounts) {
        for (const mediumCount of mediumCounts) {
            for (const smallCount of smallCounts) {
                const candidate = fit(
                    containerSize,
                    targetLargeSize,
                    smallSizeMin,
                    smallSizeMax,
                    smallCount,
                    mediumCount,
                    largeCount,
                    targetSmallSize,
                    priority,
                );

                if (!best || candidate.cost < best.cost) {
                    best = candidate;

                    if (best.cost === 0) {
                        return best;
                    }
                }

                priority++;
            }
        }
    }

    // Every permutation was invalid; fall back to a single full-width item.
    return best ?? {
        largeSize: containerSize,
        largeCount: 1,
        mediumSize: 0,
        mediumCount: 0,
        smallSize: 0,
        smallCount: 0,
        cost: Number.POSITIVE_INFINITY,
    };
}

/**
 * Trims keylines until there are no more of them than there are items, so a short list never
 * leaves empty slots. Small items go first, then medium — never large, since large items are
 * already fully unmasked.
 *
 * Returns true when the counts changed and the arrangement needs re-solving.
 */
function trimToItemCount(candidate: Candidate, itemCount: number): boolean {
    let surplus = candidate.smallCount + candidate.mediumCount + candidate.largeCount - itemCount;
    let changed = false;

    while (surplus > 0 && (candidate.smallCount > 0 || candidate.mediumCount > 1)) {
        if (candidate.smallCount > 0) {
            candidate.smallCount--;
        } else {
            candidate.mediumCount--;
        }

        changed = true;
        surplus--;
    }

    return changed;
}

/**
 * The Material Design 3 multi-browse layout: a run of large items followed by a medium and a
 * small item, sized so the whole arrangement fills the container exactly.
 *
 * Ported from `MultiBrowseCarouselStrategy` and `Arrangement` in Material Components for
 * Android so the two implementations agree on sizing.
 */
export const multiBrowseStrategy: CarouselStrategy = {
    // Multi-browse resizes items, so it only reads correctly with items resting on keylines.
    snap: true,

    arrange(context: CarouselStrategyContext): CarouselArrangement {
        const { containerSize, itemSize, smallSizeMin, smallSizeMax, itemCount, alignment } = context;

        const maxSmallSize = Math.max(smallSizeMax, smallSizeMin);
        const targetLargeSize = Math.min(itemSize, containerSize);

        // A small item ideally reads as a third of a large one, held within its allowed range.
        const targetSmallSize = clamp(itemSize / 3, smallSizeMin, maxSmallSize);
        const targetMediumSize = (targetLargeSize + targetSmallSize) / 2;

        let smallCounts = containerSize <= smallSizeMin * 2 ? [0] : [1];
        let mediumCounts = [1, 0];

        // A centred focal range needs matching keylines on both sides of it.
        if (alignment === 'center') {
            smallCounts = smallCounts.map((count) => count * 2);
            mediumCounts = mediumCounts.map((count) => count * 2);
        }

        const minLargeSpace = containerSize
            - targetMediumSize * Math.max(...mediumCounts)
            - maxSmallSize * Math.max(...smallCounts);

        const largeCountMin = Math.max(1, Math.floor(minLargeSpace / targetLargeSize));
        const largeCountMax = Math.max(largeCountMin, Math.ceil(containerSize / targetLargeSize));
        const largeCounts: number[] = [];

        for (let count = largeCountMax; count >= largeCountMin; count--) {
            largeCounts.push(count);
        }

        let arrangement = findLowestCostArrangement(
            containerSize,
            targetLargeSize,
            targetSmallSize,
            smallSizeMin,
            maxSmallSize,
            smallCounts,
            mediumCounts,
            largeCounts,
        );

        let resolve = trimToItemCount(arrangement, itemCount);

        // An arrangement of nothing but large items has no visual hint that the list continues,
        // so force a small item back in whenever there is room for one.
        if (arrangement.mediumCount === 0 && arrangement.smallCount === 0 && containerSize > 2 * smallSizeMin) {
            arrangement.smallCount = 1;
            resolve = true;
        }

        if (resolve) {
            arrangement = findLowestCostArrangement(
                containerSize,
                targetLargeSize,
                targetSmallSize,
                smallSizeMin,
                maxSmallSize,
                [arrangement.smallCount],
                [arrangement.mediumCount],
                [arrangement.largeCount],
            );
        }

        return {
            largeSize: arrangement.largeSize,
            largeCount: arrangement.largeCount,
            mediumSize: arrangement.mediumSize,
            mediumCount: arrangement.mediumCount,
            smallSize: arrangement.smallSize,
            smallCount: arrangement.smallCount,
        };
    },
};

/**
 * Registry of the available carousel layouts.
 *
 * Adding a layout means implementing {@link CarouselStrategy}, widening `CarouselLayout` and
 * adding the entry here — no changes to the component itself.
 */
export const CAROUSEL_STRATEGIES: Record<CarouselLayout, CarouselStrategy> = {
    'multi-browse': multiBrowseStrategy,
};
