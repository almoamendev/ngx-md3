import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ElevationTokensComponent } from './elevation-tokens.component';

describe('ElevationTokensComponent', () => {
  let component: ElevationTokensComponent;
  let fixture: ComponentFixture<ElevationTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElevationTokensComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevationTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should document every elevation level', () => {
    expect(component.total).toBe(6);
  });
});
