import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { ListItem } from './list-item';
import { List } from '../list';

describe('ListItem', () => {
  let component: ListItem;
  let fixture: ComponentFixture<ListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be draggable outside a list', () => {
    expect(component.isDraggable()).toBeFalse();
    expect(fixture.nativeElement.classList).not.toContain('draggable');
  });
});

@Component({
  imports: [List, ListItem],
  template: `
    <md3-list [draggable]="draggable()">
      <md3-list-item>One</md3-list-item>
      <md3-list-item [drag-disabled]="true">Two</md3-list-item>
    </md3-list>
  `,
})
class DraggableListHost {
  public draggable = signal(false);
}

describe('ListItem in a draggable list', () => {
  let fixture: ComponentFixture<DraggableListHost>;
  let items: HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableListHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableListHost);
    fixture.detectChanges();
    items = Array.from(fixture.nativeElement.querySelectorAll('md3-list-item'));
  });

  it('should keep a plain item without state layer while the list is not draggable', () => {
    expect(items[0].classList).not.toContain('draggable');
    expect(items[0].classList).not.toContain('md3-state-component');
    expect(items[0].querySelector(':scope > .md3-state-layer')).toBeNull();
  });

  it('should enable dragging and the state layer when the list is draggable', () => {
    fixture.componentInstance.draggable.set(true);
    fixture.detectChanges();

    expect(items[0].classList).toContain('draggable');
    expect(items[0].classList).toContain('md3-state-component');
    expect(items[0].querySelector(':scope > .md3-state-layer')).not.toBeNull();
  });

  it('should respect drag-disabled', () => {
    fixture.componentInstance.draggable.set(true);
    fixture.detectChanges();

    const drags = fixture.debugElement.queryAll((el) => el.name === 'md3-list-item').map((el) => el.injector.get(CdkDrag));

    expect(drags[0].disabled).toBeFalse();
    expect(drags[1].disabled).toBeTrue();
    expect(items[1].classList).not.toContain('draggable');
    expect(items[1].classList).not.toContain('md3-state-component');
  });
});
