import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { NavBarConfig } from './nav-bar-config';

describe('NavBarConfig', () => {
  let component: NavBarConfig;
  let fixture: ComponentFixture<NavBarConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
