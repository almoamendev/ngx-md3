import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOption } from './select-option';

@Component({
  selector: 'md3-test-select-option-host',
  imports: [SelectOption],
  template: `<md3-select-option value="ny">New York</md3-select-option>`,
})
class TestSelectOptionHost {
  public readonly option = viewChild.required(SelectOption);
}

describe('SelectOption', () => {
  let fixture: ComponentFixture<TestSelectOptionHost>;
  let component: SelectOption;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSelectOptionHost],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSelectOptionHost);
    fixture.detectChanges();
    component = fixture.componentInstance.option();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reads as its own text when no label is given', () => {
    expect(component.viewValue()).toBe('New York');
  });

  it('is neither selected nor hidden without a select around it', () => {
    expect(component.isSelected()).toBe(false);
    expect(component.isHidden()).toBe(false);
  });

  it('exposes disabled as a plain boolean, which is what the key manager reads', () => {
    expect(component.disabled).toBe(false);

    fixture.componentRef.setInput('value', 'ny');
    expect(typeof component.disabled).toBe('boolean');
  });

  it('tracks the active styles the key manager applies', () => {
    component.setActiveStyles();
    expect(component.isActive()).toBe(true);

    component.setInactiveStyles();
    expect(component.isActive()).toBe(false);
  });
});
