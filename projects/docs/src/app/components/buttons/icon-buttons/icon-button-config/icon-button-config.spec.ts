import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { IconButtonConfig } from './icon-button-config';

describe('IconButtonConfig', () => {
  let component: IconButtonConfig;
  let fixture: ComponentFixture<IconButtonConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconButtonConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
