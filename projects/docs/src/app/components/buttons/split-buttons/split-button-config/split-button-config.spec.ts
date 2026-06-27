import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitButtonConfig } from './split-button-config';

describe('SplitButtonConfig', () => {
  let component: SplitButtonConfig;
  let fixture: ComponentFixture<SplitButtonConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitButtonConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitButtonConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
