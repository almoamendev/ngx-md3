/**
 * What happens to a dialog that is already open when a new dialog opens.
 * - close: the open dialogs are closed before the new one opens.
 * - hide: the dialog on top is hidden and shown again once the new one closes.
 */
export type PreviousDialog = 'close' | 'hide';
