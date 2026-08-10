import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetActions } from './bottom-sheet-actions';

describe('BottomSheetActions', () => {
  let component: BottomSheetActions;
  let fixture: ComponentFixture<BottomSheetActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheetActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSheetActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
