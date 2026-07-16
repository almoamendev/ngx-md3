import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylesMenu } from './styles-menu';

describe('StylesMenu', () => {
  let component: StylesMenu;
  let fixture: ComponentFixture<StylesMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylesMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylesMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
