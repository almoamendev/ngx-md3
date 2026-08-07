/**
 * Size band a carousel item currently renders at.
 *
 * Item sizes are continuous, so this is the nearest of the arrangement's three sizes rather than
 * the keyline the item happens to be resting on. It changes as the item is scrolled, and is
 * mirrored onto the element as `md3-large`, `md3-medium` or `md3-small`.
 */
export type CarouselItemSize = 'large' | 'medium' | 'small';
