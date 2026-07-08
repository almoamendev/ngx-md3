import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundationsMenu } from './foundations-menu';

describe('FoundationsMenu', () => {
  let component: FoundationsMenu;
  let fixture: ComponentFixture<FoundationsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundationsMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundationsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
