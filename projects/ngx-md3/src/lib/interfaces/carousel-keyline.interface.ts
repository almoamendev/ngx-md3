import { CarouselItemSize } from '../types/carousel-item-size.type';
import { CarouselArrangement } from './carousel-arrangement.interface';

/**
 * A single slot in the carousel container.
 *
 * An item does not have a fixed size: it adopts the size of whichever keyline it is currently
 * passing through, interpolating continuously between neighbours as it scrolls.
 *
 * Two coordinate systems are in play, both measured along the scroll axis from the container's
 * logical start edge:
 *
 * - **screen space** (`screenLoc`) — where the keyline actually renders, the running sum of
 *   masked sizes.
 * - **scroll space** (`scrollLoc`) — where the keyline sits if every item were fully unmasked.
 *   Keylines are always `largeSize` apart here, which is what makes item positions a simple
 *   function of `scrollLeft`.
 */
export interface CarouselKeyline {
    /** Centre of the keyline in scroll space. Used to look an item up by its scroll position. */
    scrollLoc: number;
    /** Centre of the keyline in screen space. Used to position the item. */
    screenLoc: number;
    /** Rendered size of an item resting exactly on this keyline. */
    maskedSize: number;
    /** True for the large keylines — the "selected" region of the carousel. */
    isFocal: boolean;
    /** True for the off-screen keylines items shrink into as they leave the container. */
    isAnchor: boolean;
}

/**
 * A complete keyline arrangement for one discrete shift step.
 *
 * Every state in a carousel holds the same number of keylines, so states can be interpolated
 * index by index.
 */
export interface CarouselKeylineState {
    keylines: CarouselKeyline[];
    /** Offset of the focal region's leading edge, in screen space. */
    focalStart: number;
    firstFocalIndex: number;
    lastFocalIndex: number;
}

/**
 * Everything needed to place items for a given container size, resolved once per layout pass.
 */
export interface CarouselGeometry {
    /** The solved arrangement this geometry was built from. */
    arrangement: CarouselArrangement;
    /** Shift steps ordered by ascending `focalStart`, from the start state to the end state. */
    steps: CarouselKeylineState[];
    /** Index within `steps` of the arrangement's resting state. */
    defaultStep: number;
    /** Size of a fully unmasked item, and the scroll distance between consecutive items. */
    itemSize: number;
    /** Scroll distance over which keylines shift while approaching the start of the list. */
    startShiftRange: number;
    /** Scroll distance over which keylines shift while approaching the end of the list. */
    endShiftRange: number;
    /** Largest valid scroll offset. */
    maxScroll: number;
    /**
     * Highest index the carousel can come to rest on.
     *
     * The final `largeCount` items share the focal range at `maxScroll`, so they are all visible
     * at once and none of them has a resting position of its own. Scrolling past this index is
     * impossible, which is why it is the point where the carousel counts as being at the end.
     */
    lastIndex: number;
    /** Total inline size of the scrollable content. */
    scrollSize: number;
}

/**
 * Resolved placement for a single item at a given scroll offset.
 */
export interface CarouselItemGeometry {
    /** Distance from the container's logical start edge to the item's leading edge. */
    offset: number;
    /** Current rendered size of the item. */
    maskedSize: number;
    /** Which of the arrangement's three sizes the item currently renders closest to. */
    size: CarouselItemSize;
    /** 0 when fully unmasked, approaching 1 as the item crops away. */
    maskRatio: number;
    /** True while the item rests within the focal region. */
    isFocal: boolean;
    /** False when the item is outside the container and should not be rendered. */
    isVisible: boolean;
}
