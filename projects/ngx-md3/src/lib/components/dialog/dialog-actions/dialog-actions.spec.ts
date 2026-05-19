import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogActions } from './dialog-actions';

describe('DialogActions', () => {
  let component: DialogActions;
  let fixture: ComponentFixture<DialogActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
