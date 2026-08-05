import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenDialogHeader } from './full-screen-dialog-header';

describe('FullScreenDialogHeader', () => {
  let component: FullScreenDialogHeader;
  let fixture: ComponentFixture<FullScreenDialogHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenDialogHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenDialogHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
