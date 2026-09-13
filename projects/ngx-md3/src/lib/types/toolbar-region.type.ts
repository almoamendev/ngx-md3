/**
 * The scaffold region a toolbar sits in, named by its logical side.
 *
 * `blockStart` and `blockEnd` are the top and bottom scaffold bars. `inlineStart` and
 * `inlineEnd` are the leading and trailing scaffold rails. The names are logical, so they
 * follow the document direction.
 */
export type ToolbarRegion = 'blockStart' | 'blockEnd' | 'inlineStart' | 'inlineEnd';
