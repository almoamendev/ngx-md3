import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFieldConfig } from './select-field-config';

describe('SelectFieldConfig', () => {
  let component: SelectFieldConfig;
  let fixture: ComponentFixture<SelectFieldConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectFieldConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
