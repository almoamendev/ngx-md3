import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Select } from './select';
import { SelectOption } from './select-option/select-option';

@Component({
  selector: 'md3-test-select-host',
  imports: [Select, SelectOption, ReactiveFormsModule],
  template: `
    <md3-select
      [formControl]="control"
      [multiple]="multiple()"
      [searchable]="searchable()"
      [filter-mode]="filterMode()"
      label="City">
      <md3-select-option value="ny">New York</md3-select-option>
      <md3-select-option value="bos">Boston</md3-select-option>
      <md3-select-option value="aus" disabled>Austin</md3-select-option>
    </md3-select>
  `,
})
class TestSelectHost {
  public readonly select = viewChild.required(Select);
  public readonly control = new FormControl<string | string[] | null>(null);
  public readonly multiple = signal(false);
  public readonly searchable = signal(false);
  public readonly filterMode = signal<'auto' | 'manual'>('auto');
}

describe('Select', () => {
  let fixture: ComponentFixture<TestSelectHost>;
  let host: TestSelectHost;
  let select: Select<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSelectHost],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSelectHost);
    fixture.detectChanges();
    host = fixture.componentInstance;
    select = host.select();
  });

  it('should create', () => {
    expect(select).toBeTruthy();
  });

  it('finds the options declared inside it while the panel is closed', () => {
    expect(select.isOpen()).toBe(false);
    expect(select.options().length).toBe(3);
  });

  describe('as a form control', () => {
    it('takes a value written by the form without reporting a change back', () => {
      host.control.setValue('ny');
      fixture.detectChanges();

      expect(select.selection()).toEqual(['ny']);
      // writeValue calling onChange would have marked the control dirty from the view side.
      expect(host.control.dirty).toBe(false);
    });

    it('reports a value the user picked', () => {
      select.selectValue('bos');
      fixture.detectChanges();

      expect(host.control.value).toBe('bos');
      expect(select.selection()).toEqual(['bos']);
    });

    it('clears back to null rather than an empty array for a single select', () => {
      host.control.setValue('ny');
      fixture.detectChanges();

      host.control.setValue(null);
      fixture.detectChanges();

      expect(select.selection()).toEqual([]);
      expect(host.control.value).toBeNull();
    });

    it('disables the field when the control is disabled', () => {
      host.control.disable();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

      expect(input.disabled).toBe(true);
    });

    it('refuses to open while disabled', () => {
      host.control.disable();
      fixture.detectChanges();

      select.open();
      fixture.detectChanges();

      expect(select.isOpen()).toBe(false);
    });
  });

  describe('single selection', () => {
    it('keeps the value when the option already selected is picked again', () => {
      select.selectValue('ny');
      select.selectValue('ny');
      fixture.detectChanges();

      expect(select.selection()).toEqual(['ny']);
    });

    it('replaces the value when a different option is picked', () => {
      select.selectValue('ny');
      select.selectValue('bos');
      fixture.detectChanges();

      expect(select.selection()).toEqual(['bos']);
      expect(host.control.value).toBe('bos');
    });
  });

  describe('multiple selection', () => {
    beforeEach(() => {
      host.multiple.set(true);
      fixture.detectChanges();
    });

    it('collects values into an array', () => {
      select.selectValue('ny');
      select.selectValue('bos');
      fixture.detectChanges();

      expect(host.control.value).toEqual(['ny', 'bos']);
    });

    it('unpicks a value that is picked again', () => {
      select.selectValue('ny');
      select.selectValue('bos');
      select.selectValue('ny');
      fixture.detectChanges();

      expect(host.control.value).toEqual(['bos']);
    });

    it('reports an empty array rather than null when nothing is left', () => {
      select.selectValue('ny');
      select.selectValue('ny');
      fixture.detectChanges();

      expect(host.control.value).toEqual([]);
    });
  });

  describe('the trigger', () => {
    function triggerInput(): HTMLInputElement {
      return fixture.nativeElement.querySelector('input') as HTMLInputElement;
    }

    it('is readonly until a search turns it into a search box', () => {
      expect(triggerInput().hasAttribute('readonly')).toBe(true);
    });

    it('stays empty with nothing selected, so the label rests', () => {
      expect(triggerInput().value).toBe('');
    });

    it('reads as the selected option, which is what floats the label', () => {
      select.selectValue('ny');
      fixture.detectChanges();

      expect(triggerInput().value).toBe('New York');
    });

    it('names every selection it is holding', () => {
      host.multiple.set(true);
      fixture.detectChanges();

      select.selectValue('ny');
      select.selectValue('bos');
      fixture.detectChanges();

      // How many labels survive depends on measuring a laid-out field, so only the first is
      // guaranteed; the overflow count is covered by buildTriggerLabel's own spec.
      expect(triggerInput().value).toContain('New York');
    });
  });

  describe('searching', () => {
    beforeEach(() => {
      host.searchable.set(true);
      fixture.detectChanges();
    });

    it('hides the options that do not match', () => {
      select.searchQuery.set('bos');
      fixture.detectChanges();

      const [newYork, boston] = select.options();

      expect(newYork.isHidden()).toBe(true);
      expect(boston.isHidden()).toBe(false);
    });

    it('matches without regard to case or surrounding space', () => {
      select.searchQuery.set('  NEW  ');
      fixture.detectChanges();

      expect(select.options()[0].isHidden()).toBe(false);
    });

    it('hides nothing when the consumer is filtering', () => {
      host.filterMode.set('manual');
      select.searchQuery.set('bos');
      fixture.detectChanges();

      expect(select.options().every((option) => !option.isHidden())).toBe(true);
    });

    it('keeps a selection whose option has been filtered out', () => {
      select.selectValue('ny');
      select.searchQuery.set('bos');
      fixture.detectChanges();

      expect(select.selection()).toEqual(['ny']);
      expect(select.options()[0].isHidden()).toBe(true);
    });
  });
});
