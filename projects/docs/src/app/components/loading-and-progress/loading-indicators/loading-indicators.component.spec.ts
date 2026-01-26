import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicatorsComponent } from './loading-indicators.component';

describe('LoadingIndicatorsComponent', () => {
  let component: LoadingIndicatorsComponent;
  let fixture: ComponentFixture<LoadingIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
