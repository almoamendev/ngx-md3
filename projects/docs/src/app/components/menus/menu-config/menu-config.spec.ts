import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { MenuConfig } from './menu-config';

describe('MenuConfig', () => {
  let component: MenuConfig;
  let fixture: ComponentFixture<MenuConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
