import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { SplitButtonConfig } from './split-button-config';

describe('SplitButtonConfig', () => {
  let component: SplitButtonConfig;
  let fixture: ComponentFixture<SplitButtonConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitButtonConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitButtonConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
