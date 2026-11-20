import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBody } from './dialog-body';

describe('DialogBody', () => {
  let component: DialogBody;
  let fixture: ComponentFixture<DialogBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBody]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
