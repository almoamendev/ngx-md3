import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetsComponent } from './bottom-sheets.component';

describe('BottomSheetsComponent', () => {
  let component: BottomSheetsComponent;
  let fixture: ComponentFixture<BottomSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
