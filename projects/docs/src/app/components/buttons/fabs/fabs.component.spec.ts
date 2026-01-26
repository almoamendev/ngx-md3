import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabsComponent } from './fabs.component';

describe('FabsComponent', () => {
  let component: FabsComponent;
  let fixture: ComponentFixture<FabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
