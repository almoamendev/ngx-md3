/**
 * Where the toolbar sits along its main axis.
 *
 * A docked toolbar fills its region, so the value moves the item row inside the container. A
 * floating toolbar is as wide as its content, so the value moves the container itself, and the
 * FAB with it, inside the region.
 */
export type ToolbarAlignment = 'start' | 'center' | 'end';
