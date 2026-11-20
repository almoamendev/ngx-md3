import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { List, ListItem } from '@almoamendev/ngx-md3/list';

import { LIST_REORDER } from './list-reorder';

@Component({
  imports: [List, ListItem, LIST_REORDER],
  template: `
    <md3-list type="segmented" [draggable]="draggable()" (dropped)="drop($event)">
      @for (item of items(); track item) {
        <md3-list-item [attr.data-item]="item" [drag-disabled]="item === 'C'"></md3-list-item>
      }
    </md3-list>
    <md3-list>
      <md3-list-item>Plain</md3-list-item>
    </md3-list>
  `,
  styles: `md3-list { display: block; width: 200px; } md3-list-item { display: block; height: 40px; }`,
})
class ReorderListHost {
  public draggable = signal(true);
  public items = signal(['A', 'B', 'C']);
  public drops = 0;

  public drop(event: CdkDragDrop<unknown>): void {
    this.drops++;
    const next = [...this.items()];
    moveItemInArray(next, event.previousIndex, event.currentIndex);
    this.items.set(next);
  }
}

describe('ListReorder', () => {
  let fixture: ComponentFixture<ReorderListHost>;
  let host: ReorderListHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReorderListHost]
    })
    .compileComponents();

    spyOn(console, 'warn');
    fixture = TestBed.createComponent(ReorderListHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function items(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('md3-list:first-of-type > md3-list-item:not(.cdk-drag-preview)'));
  }

  function drags(): CdkDrag[] {
    return fixture.debugElement.queryAll((el) => el.name === 'md3-list-item').map((el) => el.injector.get(CdkDrag));
  }

  function mouse(target: EventTarget, type: string, x: number, y: number): void {
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, buttons: 1, detail: 1 }));
  }

  /** Presses the item, moves it by `dy` pixels and returns a function that releases it. */
  function startDrag(item: HTMLElement, dy: number): () => void {
    const rect = item.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    mouse(item, 'mousedown', x, y);
    fixture.detectChanges();
    mouse(document, 'mousemove', x, y + 10);
    mouse(document, 'mousemove', x, y + dy);
    fixture.detectChanges();

    return () => {
      mouse(document, 'mouseup', x, y + dy);
      fixture.detectChanges();
    };
  }

  async function waitForDrops(count: number): Promise<void> {
    for (let i = 0; i < 100 && host.drops < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    fixture.detectChanges();
  }

  it('should make the list a vertical drop list and its items draggable', () => {
    const list = fixture.debugElement.query((el) => el.name === 'md3-list').injector.get(CdkDropList);

    expect(list.lockAxis).toBe('y');
    expect(list.disabled).toBeFalse();
    expect(drags().map((drag) => drag.disabled)).toEqual([false, false, true, true]);
    expect(items()[0].classList).toContain('draggable');
    expect(items()[0].classList).toContain('md3-state-component');
    expect(items()[0].querySelector(':scope > .md3-state-layer')).not.toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should reorder the items when one is dropped further down', async () => {
    const release = startDrag(items()[0], 50);
    release();
    await waitForDrops(1);

    expect(host.drops).toBe(1);
    expect(host.items()).toEqual(['B', 'A', 'C']);
    expect(items().map((item) => item.dataset["item"])).toEqual(['B', 'A', 'C']);
  });

  it('should show the dragged item with its state layer in a preview inside the list', async () => {
    const release = startDrag(items()[0], 20);
    const preview = fixture.nativeElement.querySelector('.cdk-drag-preview') as HTMLElement;

    expect(preview).not.toBeNull();
    expect(preview.parentElement?.tagName.toLowerCase()).toBe('md3-list');
    expect(preview.classList).toContain('draggable');
    expect(preview.querySelector(':scope > .md3-state-layer')).not.toBeNull();

    release();
    await waitForDrops(1);
  });

  it('should not drag a drag-disabled item', async () => {
    const release = startDrag(items()[2], -50);

    expect(fixture.nativeElement.querySelector('.cdk-drag-preview')).toBeNull();
    expect(items()[2].classList).not.toContain('draggable');
    expect(items()[2].classList).not.toContain('md3-state-component');

    release();
    await waitForDrops(1);

    expect(host.drops).toBe(0);
    expect(host.items()).toEqual(['A', 'B', 'C']);
  });

  it('should stop dragging while draggable is false', () => {
    host.draggable.set(false);
    fixture.detectChanges();

    expect(drags().every((drag) => drag.disabled)).toBeTrue();
    expect(items()[0].classList).not.toContain('draggable');
    expect(items()[0].classList).not.toContain('md3-state-component');
  });

  it('should leave a list without draggable alone', () => {
    const plain = fixture.nativeElement.querySelectorAll('md3-list')[1] as HTMLElement;

    expect(plain.classList).not.toContain('cdk-drop-list');
    expect(plain.querySelector('md3-list-item')?.classList).not.toContain('draggable');
  });
});
