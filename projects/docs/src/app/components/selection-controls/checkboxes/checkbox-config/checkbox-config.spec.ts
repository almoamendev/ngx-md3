import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { CheckboxConfig } from './checkbox-config';

describe('CheckboxConfig', () => {
  let component: CheckboxConfig;
  let fixture: ComponentFixture<CheckboxConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
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
