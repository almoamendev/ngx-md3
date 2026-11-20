import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { BadgeConfig } from './badge-config';

describe('BadgeConfig', () => {
  let component: BadgeConfig;
  let fixture: ComponentFixture<BadgeConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
