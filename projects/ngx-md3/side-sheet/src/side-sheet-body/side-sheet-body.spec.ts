import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetBody } from './side-sheet-body';

describe('SideSheetBody', () => {
  let component: SideSheetBody;
  let fixture: ComponentFixture<SideSheetBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetBody]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
