import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, SideSheetRef } from '@almoamendev/ngx-md3';

import { SampleFullScreenDialog, SampleFullScreenSheet } from './sample-fullscreen-dialog';

describe('SampleFullScreenDialog', () => {
  let component: SampleFullScreenDialog;
  let fixture: ComponentFixture<SampleFullScreenDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleFullScreenDialog],
      // Outside of DialogService there is no reference to inject.
      providers: [{ provide: DialogRef, useValue: { close: () => {} } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleFullScreenDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SampleFullScreenSheet', () => {
  let component: SampleFullScreenSheet;
  let fixture: ComponentFixture<SampleFullScreenSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleFullScreenSheet],
      providers: [{ provide: SideSheetRef, useValue: { close: () => {} } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleFullScreenSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
