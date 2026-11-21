import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DialogRef } from './dialog-ref';
import { DialogService } from './dialog.service';

@Component({
  selector: 'md3-test-dialog-content',
  template: `content`,
})
class TestDialogContent { }

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogService);
  });

  afterEach(async () => {
    await service.closeAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the scale on the dialog panel only when one is given', () => {
    const scaled = service.open(TestDialogContent, { scale: 1.25 });
    expect(scaled.overlayRef.overlayElement.style.getPropertyValue('--md3-scale')).toBe('1.25');

    const inherited = service.open(TestDialogContent, { previousDialog: 'hide' });
    expect(inherited.overlayRef.overlayElement.style.getPropertyValue('--md3-scale')).toBe('');
  });

  describe('restoring dialogs', () => {
    /** Longer than the handover delay and the exit animation fallback together. */
    const SETTLE_MS = 1000;

    beforeEach(() => {
      jasmine.clock().install();
    });

    // Runs before the outer afterEach, so every dialog is already closed by
    // the time the real timers are back.
    afterEach(async () => {
      const closed = service.closeAll();
      await advance(SETTLE_MS);
      await closed;
      jasmine.clock().uninstall();
    });

    /** Moves the mocked clock forward and lets the promises waiting on it settle. */
    async function advance(ms: number): Promise<void> {
      jasmine.clock().tick(ms);

      for (let index = 0; index < 10; index++) {
        await Promise.resolve();
      }
    }

    function expectHidden(ref: DialogRef<any, any>): void {
      const panel = ref.overlayRef.overlayElement;

      expect(ref.isHidden).withContext('isHidden').toBeTrue();
      expect(panel.classList.contains('md3-dialog-hidden')).withContext('hidden class').toBeTrue();
      expect(panel.hasAttribute('inert')).withContext('inert').toBeTrue();
    }

    function expectVisible(ref: DialogRef<any, any>): void {
      const panel = ref.overlayRef.overlayElement;

      expect(ref.isHidden).withContext('isHidden').toBeFalse();
      expect(panel.classList.contains('md3-dialog-hidden')).withContext('hidden class').toBeFalse();
      expect(panel.hasAttribute('inert')).withContext('inert').toBeFalse();
    }

    it('should not show a full screen dialog the app hid while the dialog above it was closing', async () => {
      const player = service.openFullScreen(TestDialogContent, { disableCloseEvents: true });
      await advance(SETTLE_MS);

      const regular = service.open(TestDialogContent);
      await advance(SETTLE_MS);
      expectVisible(player);

      // The dialog closes, then the app moves the player to picture in
      // picture before the handover delay is over.
      const closed = regular.close();
      await advance(50);
      void player.hide();

      await advance(SETTLE_MS);
      await closed;

      expectHidden(player);
      expect(service.visibleDialogs).toEqual([]);
    });

    it('should keep a full screen dialog hidden when the app hid it before a dialog opened over it', async () => {
      const player = service.openFullScreen(TestDialogContent, { disableCloseEvents: true });
      await advance(SETTLE_MS);
      void player.hide();
      await advance(SETTLE_MS);

      const regular = service.open(TestDialogContent);
      await advance(SETTLE_MS);
      const closed = regular.close();
      await advance(SETTLE_MS);
      await closed;

      expectHidden(player);
    });

    it('should still restore a dialog hidden through previousDialog: hide', async () => {
      const first = service.open(TestDialogContent);
      await advance(SETTLE_MS);

      const second = service.open(TestDialogContent, { previousDialog: 'hide' });
      await advance(SETTLE_MS);
      expectHidden(first);

      const closed = second.close();
      await advance(SETTLE_MS);
      await closed;

      expectVisible(first);
    });

    it('should not restore a dialog hidden behind another one once the app hid it as well', async () => {
      const first = service.open(TestDialogContent);
      await advance(SETTLE_MS);

      const second = service.open(TestDialogContent, { previousDialog: 'hide' });
      await advance(SETTLE_MS);
      void first.hide();

      const closed = second.close();
      await advance(SETTLE_MS);
      await closed;

      expectHidden(first);

      first.show();
      expectVisible(first);
    });

    it('should restore the context a full screen dialog replaced with previousDialog: hide', async () => {
      const host = service.openFullScreen(TestDialogContent);
      await advance(SETTLE_MS);
      const regular = service.open(TestDialogContent);
      await advance(SETTLE_MS);

      const takeover = service.openFullScreen(TestDialogContent, { previousDialog: 'hide' });
      await advance(SETTLE_MS);
      expectHidden(host);
      expectHidden(regular);

      const closed = takeover.close();
      await advance(SETTLE_MS);
      await closed;

      expectVisible(host);
      expectVisible(regular);
    });

    it('should not bring back the host full screen dialog when the app hid it', async () => {
      const host = service.openFullScreen(TestDialogContent);
      await advance(SETTLE_MS);
      const first = service.open(TestDialogContent);
      await advance(SETTLE_MS);
      const second = service.open(TestDialogContent, { previousDialog: 'hide' });
      await advance(SETTLE_MS);

      void host.hide();
      await advance(SETTLE_MS);

      const closed = second.close();
      await advance(SETTLE_MS);
      await closed;

      expectVisible(first);
      expectHidden(host);
    });

    it('should let showAll bring back what hideAll hid, but not a dialog the app hid', async () => {
      const player = service.openFullScreen(TestDialogContent);
      await advance(SETTLE_MS);
      const regular = service.open(TestDialogContent);
      await advance(SETTLE_MS);

      await Promise.all([service.hideAll(), advance(SETTLE_MS)]);
      service.showAll();
      expectVisible(player);
      expectVisible(regular);

      void player.hide();
      await advance(SETTLE_MS);
      await Promise.all([service.hideAll(), advance(SETTLE_MS)]);
      service.showAll();

      expectHidden(player);
      expectVisible(regular);
    });
  });

  describe('closeOnNavigation', () => {
    let location: SpyLocation;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [provideLocationMocks()] });
      service = TestBed.inject(DialogService);
      location = TestBed.inject(Location) as SpyLocation;
    });

    it('should close the dialogs on a popstate by default', () => {
      const regular = service.open(TestDialogContent);
      const fullScreen = service.openFullScreen(TestDialogContent, { previousDialog: 'hide' });
      const regularClosed = jasmine.createSpy('regular closed');
      const fullScreenClosed = jasmine.createSpy('full screen closed');
      regular.afterClosed().subscribe(regularClosed);
      fullScreen.afterClosed().subscribe(fullScreenClosed);

      location.simulateUrlPop('/previous');

      expect(regularClosed).toHaveBeenCalled();
      expect(fullScreenClosed).toHaveBeenCalled();
      expect(service.openDialogs).toEqual([]);
    });

    it('should leave the dialogs open on a popstate with closeOnNavigation: false', () => {
      const regular = service.open(TestDialogContent, { closeOnNavigation: false });
      const fullScreen = service.openFullScreen(TestDialogContent, {
        closeOnNavigation: false,
        previousDialog: 'hide',
      });

      location.simulateUrlPop('/previous');

      expect(regular.isClosing).toBeFalse();
      expect(fullScreen.isClosing).toBeFalse();
      expect(service.openDialogs).toEqual([regular, fullScreen]);
    });
  });
});
