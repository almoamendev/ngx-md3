import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { StylesMenu } from './styles-menu';

describe('StylesMenu', () => {
  let component: StylesMenu;
  let fixture: ComponentFixture<StylesMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylesMenu],
      providers: [provideRouter([]), { provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylesMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
