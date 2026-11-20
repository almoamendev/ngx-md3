import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGroup } from './menu-group';

describe('MenuGroup', () => {
  let component: MenuGroup;
  let fixture: ComponentFixture<MenuGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
