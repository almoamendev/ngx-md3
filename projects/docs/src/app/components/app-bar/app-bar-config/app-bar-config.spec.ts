import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { AppBarConfig } from './app-bar-config';

describe('AppBarConfig', () => {
  let component: AppBarConfig;
  let fixture: ComponentFixture<AppBarConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBarConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBarConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
