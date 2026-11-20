import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { ProgressConfig } from './progress-config';

describe('ProgressConfig', () => {
  let component: ProgressConfig;
  let fixture: ComponentFixture<ProgressConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
