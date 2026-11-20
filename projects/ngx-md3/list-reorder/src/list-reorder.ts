import { computed, Directive, effect, inject } from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { LIST_REORDER_STATE, List, ListItem, ListReorderState } from '@almoamendev/ngx-md3/list';

/**
 * Lets the items of a `draggable` list be reordered by dragging. Emits `dropped` with the item's
 * `previousIndex` and `currentIndex`; the list does not change your data.
 */
@Directive({
    selector: 'md3-list[draggable]',
    hostDirectives: [
        {
            directive: CdkDropList,
            outputs: ['cdkDropListDropped: dropped'],
        },
    ],
    providers: [
        { provide: LIST_REORDER_STATE, useExisting: ListReorder },
    ],
})
export class ListReorder implements ListReorderState {
    private list = inject(List, { self: true });
    private dropList = inject(CdkDropList, { self: true });

    public readonly enabled = computed(() => this.list.draggable());

    constructor() {
        this.dropList.lockAxis = 'y';

        effect(() => {
            this.dropList.disabled = !this.enabled();
        });
    }
}

/** Makes a list item draggable while its list is reorderable and the item is not `drag-disabled`. */
@Directive({
    selector: 'md3-list-item, label[md3-list-item], button[md3-list-item], a[md3-list-item]',
    hostDirectives: [CdkDrag],
})
export class ListReorderItem {
    private listItem = inject(ListItem, { self: true });
    private drag = inject(CdkDrag, { self: true });

    constructor() {
        // Keep the preview inside the list so it inherits the list's tokens.
        this.drag.previewContainer = 'parent';

        effect(() => {
            this.drag.disabled = !this.listItem.isDraggable();
        });
    }
}

/** Add to a component's `imports` to make its `draggable` lists reorderable. */
export const LIST_REORDER = [ListReorder, ListReorderItem] as const;
