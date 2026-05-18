import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDialog } from './sample-dialog';

describe('SampleDialog', () => {
  let component: SampleDialog;
  let fixture: ComponentFixture<SampleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
