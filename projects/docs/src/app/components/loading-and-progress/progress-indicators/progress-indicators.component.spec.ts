import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressIndicatorsComponent } from './progress-indicators.component';

describe('ProgressIndicatorsComponent', () => {
  let component: ProgressIndicatorsComponent;
  let fixture: ComponentFixture<ProgressIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressIndicatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
