import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ScaffoldComponent } from './scaffold.component';

describe('ScaffoldComponent', () => {
  let component: ScaffoldComponent;
  let fixture: ComponentFixture<ScaffoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaffoldComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaffoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
