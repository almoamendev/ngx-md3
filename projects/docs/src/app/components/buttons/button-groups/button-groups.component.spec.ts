import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ButtonGroupsComponent } from './button-groups.component';

describe('ButtonGroupsComponent', () => {
  let component: ButtonGroupsComponent;
  let fixture: ComponentFixture<ButtonGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupsComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
