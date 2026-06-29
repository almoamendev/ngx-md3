import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioConfig } from './radio-config';

describe('RadioConfig', () => {
  let component: RadioConfig;
  let fixture: ComponentFixture<RadioConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
