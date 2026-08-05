import { DialogConfig as CdkDialogConfig } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenDialog } from './full-screen-dialog';

describe('FullScreenDialog', () => {
  let component: FullScreenDialog;
  let fixture: ComponentFixture<FullScreenDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenDialog],
      // The CDK dialog container reads its configuration from DI.
      providers: [{ provide: CdkDialogConfig, useValue: new CdkDialogConfig() }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the surface that plays the transitions', () => {
    expect(component.surfaceElement).toBeTruthy();
  });
});
