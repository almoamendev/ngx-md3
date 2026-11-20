import { CarouselAlignment } from '../types/carousel-alignment.type';
import { CarouselArrangement } from './carousel-arrangement.interface';

/**
 * Everything a strategy needs to solve an arrangement. All sizes are in pixels.
 */
export interface CarouselStrategyContext {
    /** Size of the carousel along the scroll axis. */
    containerSize: number;
    /** Requested size of a fully unmasked item, gap included. */
    itemSize: number;
    /** Smallest a small item is allowed to be, gap included. */
    smallSizeMin: number;
    /** Largest a small item is allowed to be, gap included. */
    smallSizeMax: number;
    /** Number of items projected into the carousel. */
    itemCount: number;
    alignment: CarouselAlignment;
}

/**
 * Sizes and counts the items of a carousel so they fill the container in a visually balanced way.
 *
 * Implement this to add a new carousel layout, then register it in `CAROUSEL_STRATEGIES`.
 * Strategies must be pure: same context in, same arrangement out.
 */
export interface CarouselStrategy {
    /**
     * Whether items must come to rest exactly on keylines.
     *
     * Layouts that resize items need this: their arrangement only reads correctly when every
     * item is sitting on a keyline, and settling part-way through leaves items at sizes that
     * belong to no keyline at all. Layouts that keep items at a fixed size, such as uncontained,
     * can scroll freely.
     *
     * This is a property of the layout rather than something consumers choose, so that a
     * carousel can never be configured into a state that contradicts its own arrangement.
     */
    readonly snap: boolean;

    arrange(context: CarouselStrategyContext): CarouselArrangement;
}
