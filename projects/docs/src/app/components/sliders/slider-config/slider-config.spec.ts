import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { SliderConfig } from './slider-config';

describe('SliderConfig', () => {
  let component: SliderConfig;
  let fixture: ComponentFixture<SliderConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
