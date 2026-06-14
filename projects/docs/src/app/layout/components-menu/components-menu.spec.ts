import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@vip9008/ngx-md3';

import { ComponentsMenu } from './components-menu';

describe('ComponentsMenu', () => {
  let component: ComponentsMenu;
  let fixture: ComponentFixture<ComponentsMenu>;
  let sideSheetRef: jasmine.SpyObj<SideSheetRef<ComponentsMenu>>;

  beforeEach(async () => {
    sideSheetRef = jasmine.createSpyObj<SideSheetRef<ComponentsMenu>>('SideSheetRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ComponentsMenu],
      providers: [
        { provide: SideSheetRef, useValue: sideSheetRef },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the side sheet', () => {
    component.close();

    expect(sideSheetRef.close).toHaveBeenCalled();
  });
});
