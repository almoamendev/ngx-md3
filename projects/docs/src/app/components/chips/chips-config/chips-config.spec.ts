import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { ChipsConfig } from './chips-config';

describe('ChipsConfig', () => {
  let component: ChipsConfig;
  let fixture: ComponentFixture<ChipsConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipsConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipsConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
