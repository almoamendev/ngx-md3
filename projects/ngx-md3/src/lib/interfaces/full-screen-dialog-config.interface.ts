import { DialogConfig } from "./dialog-config.interface";

/**
 * Configuration of a full screen dialog. It is the dialog configuration without
 * `previousDialog`: a full screen dialog always replaces the one that is open,
 * because only one of them can be open at a time.
 */
export type FullScreenDialogConfig<D = unknown> = Omit<DialogConfig<D>, 'previousDialog'>;
