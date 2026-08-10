import { DialogConfig as CdkDialogConfig } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheet } from './bottom-sheet';

describe('BottomSheet', () => {
  let component: BottomSheet;
  let fixture: ComponentFixture<BottomSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheet],
      // The CDK dialog container reads its configuration from DI.
      providers: [{ provide: CdkDialogConfig, useValue: new CdkDialogConfig() }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
