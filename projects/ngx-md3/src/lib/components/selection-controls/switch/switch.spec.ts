import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InputElement } from '../../common/input-element';

import { Switch } from './switch';

@Component({
  imports: [Switch, InputElement],
  template: `
    <md3-switch [control]="control">
      <input md3-input-element type="checkbox">
    </md3-switch>
  `
})
class SwitchHost {
  public control = new FormControl(false);
}

describe('Switch', () => {
  let component: Switch;
  let fixture: ComponentFixture<Switch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Switch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Switch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Switch with control', () => {
  let fixture: ComponentFixture<SwitchHost>;
  let host: SwitchHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchHost);
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
