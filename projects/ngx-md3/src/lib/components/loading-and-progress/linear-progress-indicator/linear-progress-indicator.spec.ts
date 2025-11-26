import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearProgressIndicator } from './linear-progress-indicator';

describe('LinearProgressIndicator', () => {
  let component: LinearProgressIndicator;
  let fixture: ComponentFixture<LinearProgressIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearProgressIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinearProgressIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
