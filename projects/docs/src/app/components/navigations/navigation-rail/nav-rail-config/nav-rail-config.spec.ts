import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRailConfig } from './nav-rail-config';

describe('NavRailConfig', () => {
  let component: NavRailConfig;
  let fixture: ComponentFixture<NavRailConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavRailConfig]
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
