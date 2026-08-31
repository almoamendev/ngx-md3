/**
 * The toolbar container style.
 *
 * `floating` draws a rounded, elevated container with an outside margin. In a scaffold bar
 * region it leaves the layout flow, so the content passes behind it. In a scaffold rail
 * region it stays in the flow and reserves its own space.
 *
 * `docked` fills its region, has square corners and no elevation. The Material 3
 * specification allows it in a bar region only, because it spans the full window width.
 */
export type ToolbarType = 'floating' | 'docked';
