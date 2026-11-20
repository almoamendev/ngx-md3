import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButton } from './icon-button';

describe('IconButton', () => {
  let component: IconButton;
  let fixture: ComponentFixture<IconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle state', () => {
    @Component({
      imports: [IconButton],
      template: `
        <button md3-icon-button id="toggle" [(selected)]="selected">Toggle</button>
        <button md3-icon-button id="plain">Plain</button>
        <button md3-icon-button id="app-managed" aria-pressed="true">Mute</button>
      `,
    })
    class Host {
      selected = signal<boolean | null>(false);
    }

    let host: ComponentFixture<Host>;
    const el = (id: string) => host.nativeElement.querySelector('#' + id) as HTMLButtonElement;

    beforeEach(() => {
      host = TestBed.createComponent(Host);
      host.detectChanges();
    });

    it('sets aria-pressed on a toggle and follows clicks', () => {
      expect(el('toggle').getAttribute('aria-pressed')).toBe('false');

      el('toggle').click();
      host.detectChanges();
      expect(el('toggle').getAttribute('aria-pressed')).toBe('true');
      expect(el('toggle').classList).toContain('md3-selected');
    });

    it('removes aria-pressed when the button stops being a toggle', () => {
      host.componentInstance.selected.set(null);
      host.detectChanges();
      expect(el('toggle').hasAttribute('aria-pressed')).toBeFalse();
    });

    it('leaves aria-pressed off a plain button and keeps one the app set', () => {
      expect(el('plain').hasAttribute('aria-pressed')).toBeFalse();
      expect(el('app-managed').getAttribute('aria-pressed')).toBe('true');
    });
  });
});
