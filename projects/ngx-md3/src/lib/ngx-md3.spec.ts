import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMd3 } from './ngx-md3';

describe('NgxMd3', () => {
  let component: NgxMd3;
  let fixture: ComponentFixture<NgxMd3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMd3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMd3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
