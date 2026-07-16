import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFieldConfig } from './text-field-config';

describe('TextFieldConfig', () => {
  let component: TextFieldConfig;
  let fixture: ComponentFixture<TextFieldConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFieldConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextFieldConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
