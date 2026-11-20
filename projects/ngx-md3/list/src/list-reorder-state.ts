import { InjectionToken, Signal } from '@angular/core';

/** Whether a list currently lets its items be reordered. */
export interface ListReorderState {
    readonly enabled: Signal<boolean>;
}

/**
 * Provided by `ListReorder` from `@almoamendev/ngx-md3/list-reorder`, so the list and its items can
 * show the draggable state without loading `@angular/cdk/drag-drop` themselves.
 */
export const LIST_REORDER_STATE = new InjectionToken<ListReorderState>('MD3_LIST_REORDER_STATE');
