import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { TextFieldConfig } from './text-field-config';

describe('TextFieldConfig', () => {
  let component: TextFieldConfig;
  let fixture: ComponentFixture<TextFieldConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFieldConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
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
