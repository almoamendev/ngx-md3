import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InputElement } from '../../common/input-element';

import { RadioButton } from './radio-button';

@Component({
  imports: [RadioButton, InputElement],
  template: `
    <md3-radio-button [control]="control">
      <input md3-input-element type="radio" value="option">
    </md3-radio-button>
  `
})
class RadioButtonHost {
  public control = new FormControl('option');
}

describe('RadioButton', () => {
  let component: RadioButton;
  let fixture: ComponentFixture<RadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('RadioButton with control', () => {
  let fixture: ComponentFixture<RadioButtonHost>;
  let host: RadioButtonHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioButtonHost);
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
