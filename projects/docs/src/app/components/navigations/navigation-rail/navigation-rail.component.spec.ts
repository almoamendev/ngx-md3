import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavigationRailComponent } from './navigation-rail.component';

describe('NavigationRailComponent', () => {
  let component: NavigationRailComponent;
  let fixture: ComponentFixture<NavigationRailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationRailComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationRailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
