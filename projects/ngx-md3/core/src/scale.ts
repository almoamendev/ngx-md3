/**
 * Sets `--md3-scale` on an element, which every component inside it reads for its size.
 *
 * An undefined scale leaves the element alone, so it keeps the scale it inherits — for an
 * overlay, the one on the root.
 */
export function applyScale(element: HTMLElement | null | undefined, scale: number | undefined): void {
    if (element && scale !== undefined) {
        element.style.setProperty('--md3-scale', String(scale));
    }
}

/**
 * The scale an element is rendered at: its computed `--md3-scale`, or undefined when nothing
 * above it sets one.
 */
export function readScale(element: Element): number | undefined {
    const view = element.ownerDocument.defaultView;
    const value = Number.parseFloat(view?.getComputedStyle(element).getPropertyValue('--md3-scale') ?? '');

    return Number.isFinite(value) ? value : undefined;
}
