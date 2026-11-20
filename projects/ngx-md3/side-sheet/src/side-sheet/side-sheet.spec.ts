import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetRef } from './side-sheet-ref';
import { SideSheet } from './side-sheet';

describe('SideSheet', () => {
  let component: SideSheet;
  let fixture: ComponentFixture<SideSheet>;
  let sideSheetRef: jasmine.SpyObj<SideSheetRef>;

  beforeEach(async () => {
    sideSheetRef = jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [SideSheet],
      providers: [
        { provide: SideSheetRef, useValue: sideSheetRef },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the side sheet', () => {
    component.close();

    expect(sideSheetRef.close).toHaveBeenCalled();
  });

  it('should close the side sheet when the scrim is clicked', () => {
    const scrim = fixture.nativeElement.querySelector('.md3-side-sheet-scrim');

    scrim.click();

    expect(sideSheetRef.close).toHaveBeenCalled();
  });
});
