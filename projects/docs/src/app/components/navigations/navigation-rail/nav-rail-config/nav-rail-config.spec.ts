import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { NavRailConfig } from './nav-rail-config';

describe('NavRailConfig', () => {
  let component: NavRailConfig;
  let fixture: ComponentFixture<NavRailConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavRailConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavRailConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
