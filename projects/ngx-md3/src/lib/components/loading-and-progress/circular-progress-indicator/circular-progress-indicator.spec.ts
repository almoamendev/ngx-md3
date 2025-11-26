import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularProgressIndicator } from './circular-progress-indicator';

describe('CircularProgressIndicator', () => {
  let component: CircularProgressIndicator;
  let fixture: ComponentFixture<CircularProgressIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularProgressIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularProgressIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
