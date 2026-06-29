import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchConfig } from './switch-config';

describe('SwitchConfig', () => {
  let component: SwitchConfig;
  let fixture: ComponentFixture<SwitchConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
