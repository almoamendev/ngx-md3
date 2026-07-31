import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GridTokensComponent } from './grid-tokens.component';

describe('GridTokensComponent', () => {
  let component: GridTokensComponent;
  let fixture: ComponentFixture<GridTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridTokensComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should document every grid token', () => {
    expect(component.total).toBe(3);
  });
});
