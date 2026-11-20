import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { FabsConfig } from './fabs-config';

describe('FabsConfig', () => {
  let component: FabsConfig;
  let fixture: ComponentFixture<FabsConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabsConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabsConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
