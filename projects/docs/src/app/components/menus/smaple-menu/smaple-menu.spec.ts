import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmapleMenu } from './smaple-menu';

describe('SmapleMenu', () => {
  let component: SmapleMenu;
  let fixture: ComponentFixture<SmapleMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmapleMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmapleMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
