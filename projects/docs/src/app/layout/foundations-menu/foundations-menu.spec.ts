import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { FoundationsMenu } from './foundations-menu';

describe('FoundationsMenu', () => {
  let component: FoundationsMenu;
  let fixture: ComponentFixture<FoundationsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundationsMenu],
      providers: [provideRouter([]), { provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
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
