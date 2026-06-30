import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderConfig } from './slider-config';

describe('SliderConfig', () => {
  let component: SliderConfig;
  let fixture: ComponentFixture<SliderConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
