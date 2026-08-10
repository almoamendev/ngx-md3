/**
 * Builds what the closed field reads as. Selections past the visible count collapse into a
 * trailing "+n" so the text stays on one line whatever is picked.
 *
 * buildTriggerLabel(['New York', 'Boston', 'Austin', 'Reno'], 2) === 'New York, Boston +2'
 */
export function buildTriggerLabel(
    labels: readonly string[],
    visibleCount: number,
    separator: string = ', ',
): string {
    if (labels.length === 0) {
        return '';
    }

    // Showing nothing but a count would leave the field unreadable, so at least one label always
    // survives; an over-long single label is the input's own ellipsis to deal with.
    const visible = Math.min(Math.max(Math.floor(visibleCount), 1), labels.length);
    const shown = labels.slice(0, visible).join(separator);
    const overflow = labels.length - visible;

    return overflow > 0 ? `${shown} +${overflow}` : shown;
}
