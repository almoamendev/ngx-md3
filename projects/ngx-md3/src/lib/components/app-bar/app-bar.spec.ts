import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutService } from '../../foundations/layout.service';
import { AppBar } from './app-bar';
import { AppBarModule } from './app-bar-module';

describe('AppBar', () => {
  let component: AppBar;
  let fixture: ComponentFixture<AppBar>;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBarModule]
    })
    .compileComponents();

    layoutService = TestBed.inject(LayoutService);
    layoutService.mainScrollTop.set(0);

    fixture = TestBed.createComponent(AppBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ignore scroll offsets within the default bar height', () => {
    layoutService.mainScrollTop.set(24);
    fixture.detectChanges();

    expect(component.isScrollingDown()).toBeFalse();
  });

  it('should detect scrolling down after the default bar height', () => {
    layoutService.mainScrollTop.set(80);
    fixture.detectChanges();

    expect(component.isScrollingDown()).toBeTrue();
  });

  it('should detect scrolling up', () => {
    layoutService.mainScrollTop.set(80);
    fixture.detectChanges();

    layoutService.mainScrollTop.set(8);
    fixture.detectChanges();

    expect(component.isScrollingDown()).toBeFalse();
  });
});
