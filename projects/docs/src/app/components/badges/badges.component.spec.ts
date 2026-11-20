import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BadgesComponent } from './badges.component';

describe('BadgesComponent', () => {
  let component: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgesComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
