import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TectFieldConfig } from './tect-field-config';

describe('TectFieldConfig', () => {
  let component: TectFieldConfig;
  let fixture: ComponentFixture<TectFieldConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TectFieldConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TectFieldConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
