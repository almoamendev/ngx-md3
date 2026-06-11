import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsMenu } from './components-menu';

describe('ComponentsMenu', () => {
  let component: ComponentsMenu;
  let fixture: ComponentFixture<ComponentsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
