import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItem } from './menu-item';

describe('MenuItem', () => {
  let component: MenuItem;
  let fixture: ComponentFixture<MenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the selected state on click by default', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();

    fixture.nativeElement.click();

    expect(component.selected()).toBeFalse();
  });

  it('should keep the selected state on click when toggle-on-click is false', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.componentRef.setInput('toggle-on-click', false);
    fixture.detectChanges();

    fixture.nativeElement.click();

    expect(component.selected()).toBeTrue();
  });
});
