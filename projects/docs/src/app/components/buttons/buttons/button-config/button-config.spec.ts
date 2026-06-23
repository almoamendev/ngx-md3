import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonConfig } from './button-config';

describe('ButtonConfig', () => {
  let component: ButtonConfig;
  let fixture: ComponentFixture<ButtonConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
