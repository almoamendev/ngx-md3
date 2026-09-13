/**
 * What the toolbar does when the scaffold main pane scrolls down.
 *
 * `none` does nothing. `hide` moves the toolbar out of the region. `collapse` hides every
 * item that does not carry the `md3-toolbar-persistent` attribute, and keeps the FAB.
 *
 * A vertical toolbar ignores this input.
 */
export type ToolbarScrollAction = 'none' | 'hide' | 'collapse';
