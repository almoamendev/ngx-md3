import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetHeader } from './bottom-sheet-header';

describe('BottomSheetHeader', () => {
  let component: BottomSheetHeader;
  let fixture: ComponentFixture<BottomSheetHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheetHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSheetHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
