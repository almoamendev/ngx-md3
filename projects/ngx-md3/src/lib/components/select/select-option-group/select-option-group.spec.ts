import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionGroup } from './select-option-group';

describe('SelectOptionGroup', () => {
  let component: SelectOptionGroup;
  let fixture: ComponentFixture<SelectOptionGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOptionGroup],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOptionGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stays visible when it holds no options of its own', () => {
    expect(component.isHidden()).toBe(false);
  });
});
