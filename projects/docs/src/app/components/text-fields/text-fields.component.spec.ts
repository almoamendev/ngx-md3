import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TextFieldsComponent } from './text-fields.component';

describe('TextFieldsComponent', () => {
  let component: TextFieldsComponent;
  let fixture: ComponentFixture<TextFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFieldsComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
