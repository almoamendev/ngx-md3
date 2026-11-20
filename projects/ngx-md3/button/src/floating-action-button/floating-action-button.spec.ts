import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingActionButton } from './floating-action-button';

describe('FloatingActionButton', () => {
  let component: FloatingActionButton;
  let fixture: ComponentFixture<FloatingActionButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingActionButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingActionButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
