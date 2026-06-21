import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shiki } from './shiki';

describe('Shiki', () => {
  let component: Shiki;
  let fixture: ComponentFixture<Shiki>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shiki]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shiki);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
