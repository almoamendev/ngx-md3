export interface OptionScrollMetrics {
    /** Where the option starts, relative to the top of the scrolling content. */
    optionTop: number;
    optionHeight: number;
    scrollTop: number;
    viewportHeight: number;
}

/**
 * Scroll position that brings an option into view, moving no further than it has to and leaving
 * an option that is already visible where it is.
 *
 * Deliberately not `scrollIntoView()`: that walks every scrollable ancestor, so it would scroll
 * the page underneath the panel as well.
 */
export function scrollTopForOption(metrics: OptionScrollMetrics): number {
    const { optionTop, optionHeight, scrollTop, viewportHeight } = metrics;
    const optionBottom = optionTop + optionHeight;

    if (optionTop < scrollTop) {
        return optionTop;
    }

    if (optionBottom > scrollTop + viewportHeight) {
        return optionBottom - viewportHeight;
    }

    return scrollTop;
}
