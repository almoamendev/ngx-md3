import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeading } from './list-leading';

describe('ListLeading', () => {
  let component: ListLeading;
  let fixture: ComponentFixture<ListLeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListLeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLeading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
