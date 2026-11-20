import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { SelectFieldConfig } from './select-field-config';

describe('SelectFieldConfig', () => {
  let component: SelectFieldConfig;
  let fixture: ComponentFixture<SelectFieldConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
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
