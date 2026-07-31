import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeTokensComponent } from './shape-tokens.component';

describe('ShapeTokensComponent', () => {
  let component: ShapeTokensComponent;
  let fixture: ComponentFixture<ShapeTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeTokensComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should document every radius step', () => {
    expect(component.total).toBe(10);
  });
});
