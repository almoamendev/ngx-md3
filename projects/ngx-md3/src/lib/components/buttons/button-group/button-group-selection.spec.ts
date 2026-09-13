import { Component, signal, viewChild, viewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroup } from './button-group';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';
import { ButtonGroupSelection } from '../../../types/button-group-selection.type';

@Component({
  selector: 'md3-test-button-group-host',
  imports: [ButtonGroup, Button, IconButton],
  template: `
    <md3-button-group [selection]="selection()">
      <button md3-button [selected]="boundSelection()">first</button>
      <button md3-button>second</button>
      <button md3-icon-button>third</button>
    </md3-button-group>
  `,
})
class TestButtonGroupHost {
  public readonly buttons = viewChildren(Button);
  public readonly iconButton = viewChild.required(IconButton);
  public readonly selection = signal<ButtonGroupSelection>('none');
  public readonly boundSelection = signal<boolean | null>(null);
}

describe('ButtonGroup selection', () => {
  let fixture: ComponentFixture<TestButtonGroupHost>;
  let host: TestButtonGroupHost;

  const items = (): (Button | IconButton)[] => [...host.buttons(), host.iconButton()];
  const states = (): (boolean | null)[] => items().map((item) => item.isSelected());
  const click = (item: Button | IconButton): void => {
    item.element.click();
    fixture.detectChanges();
  };
  const setSelection = (selection: ButtonGroupSelection): void => {
    host.selection.set(selection);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestButtonGroupHost],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestButtonGroupHost);
    fixture.detectChanges();
    host = fixture.componentInstance;
  });

  describe('none', () => {
    it('leaves no button selectable', () => {
      expect(states()).toEqual([null, null, null]);
    });

    it('clears the buttons another mode made selectable', () => {
      setSelection('multiple');
      setSelection('none');

      expect(states()).toEqual([null, null, null]);
    });
  });

  describe('multiple', () => {
    beforeEach(() => {
      setSelection('multiple');
    });

    it('turns every button into a toggle', () => {
      expect(states()).toEqual([false, false, false]);
    });

    it('keeps more than one button selected', () => {
      click(host.buttons()[0]);
      click(host.buttons()[1]);

      expect(states()).toEqual([true, true, false]);
    });
  });

  describe('single', () => {
    beforeEach(() => {
      setSelection('single');
    });

    it('turns every button into a toggle', () => {
      expect(states()).toEqual([false, false, false]);
    });

    it('keeps only the last picked button selected', () => {
      click(host.buttons()[0]);

      expect(states()).toEqual([true, false, false]);

      click(host.iconButton());

      expect(states()).toEqual([false, false, true]);
    });
  });

  describe('manual', () => {
    beforeEach(() => {
      host.boundSelection.set(false);
      fixture.detectChanges();

      setSelection('manual');
    });

    it('makes a toggle of the bound button only', () => {
      expect(states()).toEqual([false, null, null]);
    });

    it('lets the bound button flip its own state', () => {
      click(host.buttons()[0]);

      expect(states()).toEqual([true, null, null]);

      click(host.buttons()[0]);

      expect(states()).toEqual([false, null, null]);
    });

    it('leaves the unbound buttons untouched when they are clicked', () => {
      click(host.buttons()[1]);

      expect(states()).toEqual([false, null, null]);
    });

    it('does not clear the other selected buttons when one is picked', () => {
      host.buttons()[1].isSelected.set(true);
      fixture.detectChanges();

      click(host.buttons()[0]);

      expect(states()).toEqual([true, true, null]);
    });

    it('releases the buttons another mode made selectable', () => {
      setSelection('multiple');

      expect(states()).toEqual([false, false, false]);

      setSelection('manual');

      expect(states()).toEqual([false, null, null]);
    });
  });
});
