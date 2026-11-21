/**
 * Who hid a dialog. Kept out of the public API: DialogRef marks a dialog hidden
 * through its own hide() as hidden by the app, and DialogService marks the
 * dialogs it hides to make room for another one, or through hideAll(), as
 * hidden by the service. Only the second kind is ever brought back by the
 * service on its own; a dialog the app hid stays hidden until the app shows it.
 */
export type DialogHiddenBy = 'app' | 'service';

const hiddenBy = new WeakMap<object, DialogHiddenBy>();

export function markDialogHiddenBy(ref: object, by: DialogHiddenBy): void {
    hiddenBy.set(ref, by);
}

export function clearDialogHiddenBy(ref: object): void {
    hiddenBy.delete(ref);
}

export function getDialogHiddenBy(ref: object): DialogHiddenBy | undefined {
    return hiddenBy.get(ref);
}
