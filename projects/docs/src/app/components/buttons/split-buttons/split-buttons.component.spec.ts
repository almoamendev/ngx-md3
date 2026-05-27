import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitButtonsComponent } from './split-buttons.component';

describe('SplitButtonsComponent', () => {
  let component: SplitButtonsComponent;
  let fixture: ComponentFixture<SplitButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
