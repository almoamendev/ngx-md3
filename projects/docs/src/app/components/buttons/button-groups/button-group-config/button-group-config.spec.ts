import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupConfig } from './button-group-config';

describe('ButtonGroupConfig', () => {
  let component: ButtonGroupConfig;
  let fixture: ComponentFixture<ButtonGroupConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGroupConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
