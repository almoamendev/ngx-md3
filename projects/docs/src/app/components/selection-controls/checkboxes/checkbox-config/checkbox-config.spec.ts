import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxConfig } from './checkbox-config';

describe('CheckboxConfig', () => {
  let component: CheckboxConfig;
  let fixture: ComponentFixture<CheckboxConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
