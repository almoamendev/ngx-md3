import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationRail } from './navigation-rail';

describe('NavigationRail', () => {
  let component: NavigationRail;
  let fixture: ComponentFixture<NavigationRail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationRail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationRail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
