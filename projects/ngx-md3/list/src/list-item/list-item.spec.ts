import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { Checkbox } from '@almoamendev/ngx-md3/checkbox';
import { InputElement } from '@almoamendev/ngx-md3/core';
import { RadioButton } from '@almoamendev/ngx-md3/radio';
import { Switch } from '@almoamendev/ngx-md3/switch';

import { ListItem } from './list-item';
import { List } from '../list';
import { ListSlot } from '../list-slot';

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

@Component({
  imports: [List, ListItem, ListSlot, Checkbox, RadioButton, Switch, InputElement],
  template: `
    <md3-list>
      <label md3-list-item>
        Checkbox
        <div md3-list-slot="trailing"><md3-checkbox [control]="checkbox"><input md3-input-element type="checkbox"></md3-checkbox></div>
      </label>
      <label md3-list-item>
        Radio
        <div md3-list-slot="trailing"><md3-radio-button><input md3-input-element type="radio" name="list-radio"></md3-radio-button></div>
      </label>
      <label md3-list-item>
        Switch
        <div md3-list-slot="trailing"><md3-switch [control]="switch"><input md3-input-element type="checkbox"></md3-switch></div>
      </label>
    </md3-list>
  `,
})
class ControlListHost {
  public checkbox = new FormControl<boolean | null>(false);
  public switch = new FormControl(true);
}

describe('ListItem with a selection control', () => {
  let fixture: ComponentFixture<ControlListHost>;
  let host: ControlListHost;
  let items: HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlListHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlListHost);
    host = fixture.componentInstance;
    await settle();
    items = Array.from(fixture.nativeElement.querySelectorAll('[md3-list-item]'));
  });

  // The controls sync their state from the form control in effects, and the list item reads it
  // back in its own, so a change needs a few rounds before it reaches the host classes.
  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should be selected while its checkbox or radio button is checked', async () => {
    expect(items[0].classList).not.toContain('md3-selected');
    expect(items[1].classList).not.toContain('md3-selected');

    host.checkbox.setValue(true);
    (items[1].querySelector('input') as HTMLInputElement).click();
    await settle();

    expect(items[0].classList).toContain('md3-selected');
    expect(items[1].classList).toContain('md3-selected');
  });

  it('should not be selected by a switch', () => {
    expect(items[2].classList).not.toContain('md3-selected');
  });

  it('should be disabled while its control is disabled', async () => {
    host.checkbox.disable();
    host.switch.disable();
    await settle();

    expect(items[0].classList).toContain('md3-disabled');
    expect(items[1].classList).not.toContain('md3-disabled');
    expect(items[2].classList).toContain('md3-disabled');
  });
});
