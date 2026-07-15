import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridConfig } from './grid-config';

describe('GridConfig', () => {
  let component: GridConfig;
  let fixture: ComponentFixture<GridConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
