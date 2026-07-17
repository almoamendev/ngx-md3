import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBarConfig } from './app-bar-config';

describe('AppBarConfig', () => {
  let component: AppBarConfig;
  let fixture: ComponentFixture<AppBarConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBarConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBarConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
