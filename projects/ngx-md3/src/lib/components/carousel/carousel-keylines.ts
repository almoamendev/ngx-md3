import { CarouselArrangement } from '../../interfaces/carousel-arrangement.interface';
import {
    CarouselGeometry,
    CarouselItemGeometry,
    CarouselKeyline,
    CarouselKeylineState,
} from '../../interfaces/carousel-keyline.interface';
import { CarouselAlignment } from '../../types/carousel-alignment.type';
import { CarouselItemSize } from '../../types/carousel-item-size.type';

/** Anchor size fallback, as a fraction of the large item, when an arrangement has no small items. */
const ANCHOR_FALLBACK_RATIO = 0.2;

function lerp(from: number, to: number, progress: number): number {
    return from + (to - from) * progress;
}

/** How many small and medium keylines sit before the focal range in a given shift step. */
interface ShiftStep {
    smallBefore: number;
    mediumBefore: number;
}

/**
 * Lays out one shift step.
 *
 * Keylines before the focal range ascend in size towards it and keylines after it descend away
 * from it, which is what keeps the arrangement looking balanced as it shifts. An off-screen
 * anchor sits at each end so items have somewhere to shrink into rather than popping out.
 */
function buildState(
    step: ShiftStep,
    arrangement: CarouselArrangement,
    anchorSize: number,
): CarouselKeylineState {
    const { largeSize, largeCount, mediumSize, mediumCount, smallSize, smallCount } = arrangement;

    const before: number[] = [
        ...new Array<number>(step.smallBefore).fill(smallSize),
        ...new Array<number>(step.mediumBefore).fill(mediumSize),
    ];
    const after: number[] = [
        ...new Array<number>(mediumCount - step.mediumBefore).fill(mediumSize),
        ...new Array<number>(smallCount - step.smallBefore).fill(smallSize),
    ];

    const sizes: number[] = [
        anchorSize,
        ...before,
        ...new Array<number>(largeCount).fill(largeSize),
        ...after,
        anchorSize,
    ];

    const firstFocalIndex = 1 + before.length;
    const lastFocalIndex = firstFocalIndex + largeCount - 1;

    // The leading anchor occupies [-anchorSize, 0] so the first real keyline starts at 0.
    let cursor = -anchorSize;
    const screenLocs = sizes.map((size) => {
        const loc = cursor + size / 2;
        cursor += size;
        return loc;
    });

    // In scroll space every item occupies exactly `largeSize`, so keylines are evenly spaced.
    // Anchoring that spacing to the first focal keyline keeps screen and scroll space aligned
    // wherever an item is fully unmasked.
    const focalLoc = screenLocs[firstFocalIndex];

    const keylines: CarouselKeyline[] = sizes.map((size, index) => ({
        scrollLoc: focalLoc + (index - firstFocalIndex) * largeSize,
        screenLoc: screenLocs[index],
        maskedSize: size,
        isFocal: index >= firstFocalIndex && index <= lastFocalIndex,
        isAnchor: index === 0 || index === sizes.length - 1,
    }));

    return {
        keylines,
        focalStart: focalLoc - largeSize / 2,
        firstFocalIndex,
        lastFocalIndex,
    };
}

/**
 * Enumerates every shift step from "focal range at the start of the container" through to
 * "focal range at the end", ordered by ascending `focalStart`.
 *
 * Each step moves exactly one keyline across the focal range, which is what guarantees every
 * item passes through the focal range as the carousel scrolls. Smaller keylines migrate first,
 * so items pile up smallest-outermost at whichever edge they are collecting against.
 */
function buildSteps(arrangement: CarouselArrangement, alignment: CarouselAlignment): {
    steps: CarouselKeylineState[];
    defaultStep: number;
} {
    const { smallCount, mediumCount } = arrangement;

    const restingStep: ShiftStep = alignment === 'center'
        ? { smallBefore: Math.floor(smallCount / 2), mediumBefore: Math.floor(mediumCount / 2) }
        : { smallBefore: 0, mediumBefore: 0 };

    // Walk backwards from the resting step, retiring the smallest leading keyline each time.
    const towardsStart: ShiftStep[] = [restingStep];
    let { smallBefore, mediumBefore } = restingStep;

    while (smallBefore > 0 || mediumBefore > 0) {
        if (smallBefore > 0) {
            smallBefore--;
        } else {
            mediumBefore--;
        }

        towardsStart.push({ smallBefore, mediumBefore });
    }

    // Walk forwards, promoting the smallest trailing keyline each time.
    const towardsEnd: ShiftStep[] = [restingStep];
    ({ smallBefore, mediumBefore } = restingStep);

    while (smallBefore + mediumBefore < smallCount + mediumCount) {
        if (smallBefore < smallCount) {
            smallBefore++;
        } else {
            mediumBefore++;
        }

        towardsEnd.push({ smallBefore, mediumBefore });
    }

    const ordered = [...towardsStart.slice(1).reverse(), ...towardsEnd];
    const anchorSize = arrangement.smallSize > 0
        ? arrangement.smallSize
        : arrangement.largeSize * ANCHOR_FALLBACK_RATIO;

    return {
        steps: ordered.map((step) => buildState(step, arrangement, anchorSize)),
        defaultStep: towardsStart.length - 1,
    };
}

/**
 * Turns a solved arrangement into everything the component needs to place items.
 */
export function buildGeometry(
    arrangement: CarouselArrangement,
    alignment: CarouselAlignment,
    itemCount: number,
    containerSize: number,
): CarouselGeometry {
    const { steps, defaultStep } = buildSteps(arrangement, alignment);

    const resting = steps[defaultStep];
    const startShiftRange = resting.focalStart - steps[0].focalStart;
    const endShiftRange = steps[steps.length - 1].focalStart - resting.focalStart;

    // Each item owns exactly `largeSize` of scroll range, and the final `largeCount` items share
    // the focal region, so they need no scroll range of their own.
    const lastIndex = Math.max(0, itemCount - arrangement.largeCount);
    const maxScroll = lastIndex * arrangement.largeSize;

    return {
        arrangement,
        steps,
        defaultStep,
        itemSize: arrangement.largeSize,
        startShiftRange,
        endShiftRange,
        maxScroll,
        lastIndex,
        scrollSize: maxScroll + containerSize,
    };
}

/**
 * Where the focal range sits for a given scroll offset.
 *
 * It rests at its default position through the middle of the list and slides towards whichever
 * edge is being approached, so the first and last items can reach the focal range without
 * detaching from the container edges.
 */
function focalStartFor(geometry: CarouselGeometry, scrollOffset: number): number {
    const resting = geometry.steps[geometry.defaultStep].focalStart;
    const first = geometry.steps[0].focalStart;
    const last = geometry.steps[geometry.steps.length - 1].focalStart;

    const startShift = Math.max(0, geometry.startShiftRange - scrollOffset);
    const endShift = Math.max(0, scrollOffset - (geometry.maxScroll - geometry.endShiftRange));

    return Math.min(Math.max(resting - startShift + endShift, first), last);
}

/**
 * Interpolates the two shift steps bracketing `focalStart` into a single state.
 *
 * Every step holds the same number of keylines, so this is a straight index-by-index blend.
 */
function stateAt(geometry: CarouselGeometry, focalStart: number): CarouselKeylineState {
    const { steps } = geometry;

    let upper = 1;
    while (upper < steps.length && steps[upper].focalStart < focalStart) {
        upper++;
    }

    if (upper >= steps.length) {
        return steps[steps.length - 1];
    }

    const from = steps[upper - 1];
    const to = steps[upper];
    const span = to.focalStart - from.focalStart;

    if (span <= 0) {
        return from;
    }

    const progress = Math.min(Math.max((focalStart - from.focalStart) / span, 0), 1);

    return {
        focalStart,
        firstFocalIndex: progress < 0.5 ? from.firstFocalIndex : to.firstFocalIndex,
        lastFocalIndex: progress < 0.5 ? from.lastFocalIndex : to.lastFocalIndex,
        keylines: from.keylines.map((keyline, index) => {
            const target = to.keylines[index];

            return {
                scrollLoc: lerp(keyline.scrollLoc, target.scrollLoc, progress),
                screenLoc: lerp(keyline.screenLoc, target.screenLoc, progress),
                maskedSize: lerp(keyline.maskedSize, target.maskedSize, progress),
                isFocal: progress < 0.5 ? keyline.isFocal : target.isFocal,
                isAnchor: keyline.isAnchor && target.isAnchor,
            };
        }),
    };
}

/**
 * Resolves the keyline arrangement in effect at a given scroll offset.
 */
export function resolveState(geometry: CarouselGeometry, scrollOffset: number): CarouselKeylineState {
    return stateAt(geometry, focalStartFor(geometry, scrollOffset));
}

/**
 * Finds the keylines either side of a scroll-space position, and how far between them it sits.
 */
function keylineRange(keylines: CarouselKeyline[], scrollCenter: number): [CarouselKeyline, CarouselKeyline, number] {
    let upper = 1;
    while (upper < keylines.length - 1 && keylines[upper].scrollLoc < scrollCenter) {
        upper++;
    }

    const from = keylines[upper - 1];
    const to = keylines[upper];
    const span = to.scrollLoc - from.scrollLoc;
    const progress = span <= 0 ? 0 : Math.min(Math.max((scrollCenter - from.scrollLoc) / span, 0), 1);

    return [from, to, progress];
}

/**
 * Classifies a rendered size against the arrangement's three sizes.
 *
 * Items resize continuously, so this snaps to whichever size the item currently reads as,
 * flipping at the midpoint between one size and the next.
 */
export function sizeBandFor(maskedSize: number, geometry: CarouselGeometry): CarouselItemSize {
    const { largeSize, mediumSize, smallSize } = geometry.arrangement;

    if (maskedSize >= (largeSize + mediumSize) / 2) {
        return 'large';
    }

    if (maskedSize >= (mediumSize + smallSize) / 2) {
        return 'medium';
    }

    return 'small';
}

/**
 * Places one item.
 *
 * The item's centre is a plain linear function of the scroll offset in scroll space; looking
 * that position up against the current keylines is what converts it into a rendered size and
 * an on-screen position.
 */
export function resolveItemGeometry(
    geometry: CarouselGeometry,
    state: CarouselKeylineState,
    index: number,
    scrollOffset: number,
): CarouselItemGeometry {
    const { itemSize } = geometry;
    const { keylines } = state;

    const scrollCenter = index * itemSize + itemSize / 2 - scrollOffset + state.focalStart;

    const first = keylines[0];
    const last = keylines[keylines.length - 1];

    if (scrollCenter < first.scrollLoc || scrollCenter > last.scrollLoc) {
        return {
            offset: 0,
            maskedSize: 0,
            size: 'small',
            maskRatio: 1,
            isFocal: false,
            isVisible: false,
        };
    }

    const [from, to, progress] = keylineRange(keylines, scrollCenter);

    const maskedSize = lerp(from.maskedSize, to.maskedSize, progress);
    const screenCenter = lerp(from.screenLoc, to.screenLoc, progress);

    return {
        offset: screenCenter - maskedSize / 2,
        maskedSize,
        size: sizeBandFor(maskedSize, geometry),
        maskRatio: itemSize <= 0 ? 1 : Math.min(Math.max(1 - maskedSize / itemSize, 0), 1),
        isFocal: (from.isFocal && progress < 0.5) || (to.isFocal && progress >= 0.5),
        isVisible: maskedSize > 0.5,
    };
}

/**
 * Clamps an index to one the carousel can actually come to rest on.
 */
export function clampIndex(geometry: CarouselGeometry, index: number): number {
    return Math.min(Math.max(Math.round(index), 0), geometry.lastIndex);
}

/**
 * Scroll offset at which `index` leads the focal range.
 *
 * The shifting focal range cancels out here, so this stays a simple multiple regardless of
 * alignment or how close to either end of the list the item is.
 */
export function scrollOffsetForIndex(geometry: CarouselGeometry, index: number): number {
    return clampIndex(geometry, index) * geometry.itemSize;
}

/**
 * The item leading the focal range at a given scroll offset.
 */
export function indexForScrollOffset(geometry: CarouselGeometry, scrollOffset: number): number {
    if (geometry.itemSize <= 0) {
        return 0;
    }

    return clampIndex(geometry, scrollOffset / geometry.itemSize);
}
