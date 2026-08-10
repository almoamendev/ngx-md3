import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetBody } from './bottom-sheet-body';

describe('BottomSheetBody', () => {
  let component: BottomSheetBody;
  let fixture: ComponentFixture<BottomSheetBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheetBody]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSheetBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
