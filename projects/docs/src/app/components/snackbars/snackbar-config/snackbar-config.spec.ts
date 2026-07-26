import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarConfig } from './snackbar-config';

describe('SnackbarConfig', () => {
  let component: SnackbarConfig;
  let fixture: ComponentFixture<SnackbarConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
