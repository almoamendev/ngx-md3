import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetsComponent } from './side-sheets.component';

describe('SideSheetsComponent', () => {
  let component: SideSheetsComponent;
  let fixture: ComponentFixture<SideSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
