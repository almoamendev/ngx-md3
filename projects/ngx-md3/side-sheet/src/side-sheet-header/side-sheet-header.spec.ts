import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetHeader } from './side-sheet-header';

describe('SideSheetHeader', () => {
  let component: SideSheetHeader;
  let fixture: ComponentFixture<SideSheetHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
