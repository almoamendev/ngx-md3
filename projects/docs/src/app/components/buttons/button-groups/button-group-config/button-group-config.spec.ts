import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { ButtonGroupConfig } from './button-group-config';

describe('ButtonGroupConfig', () => {
  let component: ButtonGroupConfig;
  let fixture: ComponentFixture<ButtonGroupConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGroupConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
