import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabsConfig } from './fabs-config';

describe('FabsConfig', () => {
  let component: FabsConfig;
  let fixture: ComponentFixture<FabsConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabsConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabsConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
