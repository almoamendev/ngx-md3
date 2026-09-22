import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Md3Logo } from './md3-logo';

describe('Md3Logo', () => {
  let component: Md3Logo;
  let fixture: ComponentFixture<Md3Logo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Md3Logo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Md3Logo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
