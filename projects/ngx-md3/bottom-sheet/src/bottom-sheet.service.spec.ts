import { Component, viewChildren } from '@angular/core';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { BottomSheetService } from './bottom-sheet.service';

@Component({
  selector: 'md3-test-sheet',
  template: '',
})
class TestSheet {
}

/** Outlets standing in for a page scaffold and a full screen dialog's scaffold. */
@Component({
  selector: 'md3-test-outlets',
  imports: [CdkPortalOutlet],
  template: `
    <div class="page"><ng-template cdkPortalOutlet /></div>
    <div class="dialog"><ng-template cdkPortalOutlet /></div>
  `,
})
class TestOutlets {
  public readonly outlets = viewChildren(CdkPortalOutlet);
}

describe('BottomSheetService', () => {
  let service: BottomSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('refuses to open a standard sheet with no outlet to dock into', () => {
    expect(() => service.open(TestSheet, { type: 'standard' }))
      .toThrowError(/No available bottom sheet outlet is registered/);
  });

  describe('with a dialog outlet above the page', () => {
    let host: HTMLElement;
    let page: CdkPortalOutlet;
    let dialog: CdkPortalOutlet;

    beforeEach(() => {
      const fixture = TestBed.createComponent(TestOutlets);

      fixture.detectChanges();
      host = fixture.nativeElement;
      [page, dialog] = fixture.componentInstance.outlets();
      service.registerBottomSheetOutlet(page);
      service.registerBottomSheetOutlet(dialog, { level: 'dialog' });
    });

    function sheetsIn(selector: string): number {
      return host.querySelector(selector)!.querySelectorAll('md3-test-sheet').length;
    }

    it('docks a standard sheet into the dialog by default', () => {
      service.open(TestSheet, { type: 'standard' });

      expect(sheetsIn('.dialog')).toBe(1);
      expect(sheetsIn('.page')).toBe(0);
    });

    it('docks a standard sheet into the page with host: page', () => {
      service.open(TestSheet, { type: 'standard', host: 'page' });

      expect(sheetsIn('.page')).toBe(1);
      expect(sheetsIn('.dialog')).toBe(0);
    });

    it('keeps a page sheet open when the dialog outlet goes away', () => {
      service.open(TestSheet, { type: 'standard', host: 'page' });
      service.unregisterBottomSheetOutlet(dialog);

      expect(sheetsIn('.page')).toBe(1);
    });

    it('disposes a dialog sheet when the dialog outlet goes away', () => {
      service.open(TestSheet, { type: 'standard' });
      service.unregisterBottomSheetOutlet(dialog);

      expect(sheetsIn('.page')).toBe(0);
      expect(host.querySelectorAll('md3-test-sheet').length).toBe(0);
    });
  });
});
