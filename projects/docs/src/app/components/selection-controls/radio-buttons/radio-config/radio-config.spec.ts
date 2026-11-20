import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { RadioConfig } from './radio-config';

describe('RadioConfig', () => {
  let component: RadioConfig;
  let fixture: ComponentFixture<RadioConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
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
