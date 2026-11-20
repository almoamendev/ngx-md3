import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { SnackbarConfig } from './snackbar-config';

describe('SnackbarConfig', () => {
  let component: SnackbarConfig;
  let fixture: ComponentFixture<SnackbarConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
