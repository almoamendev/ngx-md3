import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomSheetRef } from '@almoamendev/ngx-md3';

import { SampleBottomSheet } from './sample-bottom-sheet';

describe('SampleBottomSheet', () => {
  let component: SampleBottomSheet;
  let fixture: ComponentFixture<SampleBottomSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleBottomSheet],
      // Outside of BottomSheetService there is no reference to inject.
      providers: [{ provide: BottomSheetRef, useValue: { close: () => {} } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleBottomSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
