/**
 * Which scaffold a docked sheet opens in.
 *
 * - `'current'`: the topmost scaffold that can take it. While a full screen dialog with its own
 *   scaffold is up, that is the dialog.
 * - `'page'`: the app's page scaffold, even while a full screen dialog is up. The page sits under
 *   the dialog, so the sheet is out of sight until the dialog is hidden or closed, and it stays
 *   open after the dialog closes.
 */
export type SheetHost = 'current' | 'page';

/**
 * What registered a sheet outlet: a scaffold on the page, or a full screen dialog (its shell, or
 * a scaffold inside its content).
 */
export type SheetOutletLevel = 'page' | 'dialog';

export interface SheetOutletOptions {
    /** Whether new sheets can open in the outlet. False while it is in a hidden dialog. */
    isAvailable?: () => boolean;

    /** @default 'page' */
    level?: SheetOutletLevel;
}
