import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideSheetRef } from '@almoamendev/ngx-md3';

import { CardConfig } from './card-config';

describe('CardConfig', () => {
  let component: CardConfig;
  let fixture: ComponentFixture<CardConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardConfig],
      providers: [{ provide: SideSheetRef, useValue: jasmine.createSpyObj<SideSheetRef>('SideSheetRef', ['close']) }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
