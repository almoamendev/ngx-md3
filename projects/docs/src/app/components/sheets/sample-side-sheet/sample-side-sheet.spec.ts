import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { SampleSideSheet } from './sample-side-sheet';

describe('SampleSideSheet', () => {
  let component: SampleSideSheet;
  let fixture: ComponentFixture<SampleSideSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleSideSheet],
      // Outside of SheetsService there is no reference to inject.
      providers: [{ provide: SideSheetRef, useValue: { close: () => {} } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleSideSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
