import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InputElement } from '../../common/input-element';

import { Checkbox } from './checkbox';

@Component({
  imports: [Checkbox, InputElement],
  template: `
    <md3-checkbox [control]="control">
      <input md3-input-element type="checkbox">
    </md3-checkbox>
  `
})
class CheckboxHost {
  public control = new FormControl(false);
}

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Checkbox with control', () => {
  let fixture: ComponentFixture<CheckboxHost>;
  let host: CheckboxHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should sync projected input disabled state from the form control', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBeFalse();

    host.control.disable();
    fixture.detectChanges();

    expect(input.disabled).toBeTrue();

    host.control.enable();
    fixture.detectChanges();

    expect(input.disabled).toBeFalse();
  });
});
