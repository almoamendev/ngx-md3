import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionTokensComponent } from './motion-tokens.component';

describe('MotionTokensComponent', () => {
  let component: MotionTokensComponent;
  let fixture: ComponentFixture<MotionTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotionTokensComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotionTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should document a duration and an easing for every combination', () => {
    // 2 sets x 3 speeds x 2 kinds x 2 properties
    expect(component.total).toBe(24);
  });
});
