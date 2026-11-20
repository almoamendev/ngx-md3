import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { TypographyConfig } from './typography-config';

describe('TypographyConfig', () => {
  let component: TypographyConfig;
  let fixture: ComponentFixture<TypographyConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypographyConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
