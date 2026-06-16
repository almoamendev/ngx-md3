import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetActions } from './side-sheet-actions';

describe('SideSheetActions', () => {
  let component: SideSheetActions;
  let fixture: ComponentFixture<SideSheetActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
