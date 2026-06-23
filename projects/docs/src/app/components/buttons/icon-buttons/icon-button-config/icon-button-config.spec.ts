import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonConfig } from './icon-button-config';

describe('IconButtonConfig', () => {
  let component: IconButtonConfig;
  let fixture: ComponentFixture<IconButtonConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconButtonConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
