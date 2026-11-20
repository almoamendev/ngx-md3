import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { ButtonConfig } from './button-config';

describe('ButtonConfig', () => {
  let component: ButtonConfig;
  let fixture: ComponentFixture<ButtonConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
