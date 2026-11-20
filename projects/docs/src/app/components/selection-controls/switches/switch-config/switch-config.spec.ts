import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { SwitchConfig } from './switch-config';

describe('SwitchConfig', () => {
  let component: SwitchConfig;
  let fixture: ComponentFixture<SwitchConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
