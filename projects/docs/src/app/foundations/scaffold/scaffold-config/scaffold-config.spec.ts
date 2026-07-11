import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaffoldConfig } from './scaffold-config';

describe('ScaffoldConfig', () => {
  let component: ScaffoldConfig;
  let fixture: ComponentFixture<ScaffoldConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaffoldConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
