import { Component, signal } from '@angular/core';
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

@Component({
  imports: [Slider, InputElement],
  template: `
    <md3-slider>
      <input md3-input-element type="range" min="0" [max]="max()" [value]="value()">
    </md3-slider>
  `
})
class PlainSliderHost {
  public value = signal(20);
  public max = signal(100);
}

describe('Slider with plain input', () => {
  let fixture: ComponentFixture<PlainSliderHost>;
  let host: PlainSliderHost;
  let slider: Slider;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainSliderHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlainSliderHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    slider = fixture.debugElement.query(By.directive(Slider)).componentInstance as Slider;
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  });

  const flush = () => new Promise((resolve) => setTimeout(resolve));

  it('should follow a value binding change', async () => {
    expect(slider.value()).toBe(20);

    host.value.set(60);
    fixture.detectChanges();
    await flush();

    expect(slider.value()).toBe(60);
    expect(slider.progress()).toBe(60);
  });

  it('should follow direct value assignment and stepUp', async () => {
    input.value = '35';
    await flush();
    expect(slider.value()).toBe(35);
    expect(input.value).toBe('35');

    input.stepUp(5);
    await flush();
    expect(slider.value()).toBe(40);
  });

  it('should follow a max binding change', async () => {
    host.value.set(50);
    fixture.detectChanges();
    host.max.set(200);
    fixture.detectChanges();
    await flush();

    expect(slider.max()).toBe(200);
    expect(slider.progress()).toBe(25);
  });
});
