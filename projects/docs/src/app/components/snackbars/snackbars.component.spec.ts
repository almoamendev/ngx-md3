import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SnackbarsComponent } from './snackbars.component';

describe('SnackbarsComponent', () => {
  let component: SnackbarsComponent;
  let fixture: ComponentFixture<SnackbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarsComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
