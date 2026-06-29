import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputElement } from '../common/input-element';

import { Slider } from './slider';

@Component({
  imports: [Slider, InputElement],
  template: `
    <md3-slider [control]="control">
      <input md3-input-element type="range" min="0" max="100">
    </md3-slider>
  `
})
class SliderHost {
  public control = new FormControl(25);
}

describe('Slider', () => {
  let component: Slider;
  let fixture: ComponentFixture<Slider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Slider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Slider with control', () => {
  let fixture: ComponentFixture<SliderHost>;
  let host: SliderHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should sync projected input value from the form control', () => {
    const slider = fixture.debugElement.query(By.directive(Slider)).componentInstance as Slider;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(slider.value()).toBe(25);
    expect(input.valueAsNumber).toBe(25);
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
