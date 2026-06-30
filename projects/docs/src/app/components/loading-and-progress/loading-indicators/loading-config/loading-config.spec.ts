import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingConfig } from './loading-config';

describe('LoadingConfig', () => {
  let component: LoadingConfig;
  let fixture: ComponentFixture<LoadingConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
