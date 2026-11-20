/**
 * A solved distribution of large, medium and small items that exactly fills the carousel
 * container. Produced by a {@link CarouselStrategy}, consumed by the keyline builder.
 *
 * All sizes are in pixels and already include the item gap.
 */
export interface CarouselArrangement {
    /** Size of a fully unmasked item. Also the size each item occupies in scroll space. */
    largeSize: number;
    largeCount: number;

    mediumSize: number;
    mediumCount: number;

    smallSize: number;
    smallCount: number;
}
