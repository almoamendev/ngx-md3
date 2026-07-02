import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfig } from './list-config';

describe('ListConfig', () => {
  let component: ListConfig;
  let fixture: ComponentFixture<ListConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
