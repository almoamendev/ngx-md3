import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationGroup } from './navigation-group';

describe('NavigationGroup', () => {
  let component: NavigationGroup;
  let fixture: ComponentFixture<NavigationGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
