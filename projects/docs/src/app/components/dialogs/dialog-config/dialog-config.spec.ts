import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfig } from './dialog-config';

describe('DialogConfig', () => {
  let component: DialogConfig;
  let fixture: ComponentFixture<DialogConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
