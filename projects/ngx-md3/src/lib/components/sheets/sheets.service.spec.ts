import { Component, viewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CdkPortalOutlet } from '@angular/cdk/portal';

import { SheetsService } from './sheets.service';

@Component({
  selector: 'md3-test-sheet',
  template: 'sheet',
})
class TestSheet {
}

/** Three outlets standing in for a page scaffold, a dialog scaffold and a second page scaffold. */
@Component({
  selector: 'md3-test-outlets',
  imports: [CdkPortalOutlet],
  template: `
    <div class="page"><ng-template cdkPortalOutlet /></div>
    <div class="dialog"><ng-template cdkPortalOutlet /></div>
    <div class="page-2"><ng-template cdkPortalOutlet /></div>
  `,
})
class TestOutlets {
  public readonly outlets = viewChildren(CdkPortalOutlet);
}

describe('SheetsService', () => {
  let service: SheetsService;
  let host: HTMLElement;
  let page: CdkPortalOutlet;
  let dialog: CdkPortalOutlet;
  let page2: CdkPortalOutlet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetsService);

    const fixture = TestBed.createComponent(TestOutlets);

    fixture.detectChanges();
    host = fixture.nativeElement;
    [page, dialog, page2] = fixture.componentInstance.outlets();
  });

  function sheetsIn(selector: string): number {
    return host.querySelector(selector)!.querySelectorAll('md3-test-sheet').length;
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('opens in the dialog outlet by default while a dialog is up', () => {
    service.registerSideSheetOutlet('end', page);
    service.registerSideSheetOutlet('end', dialog, { level: 'dialog' });

    service.openSideSheet(TestSheet);

    expect(sheetsIn('.dialog')).toBe(1);
    expect(sheetsIn('.page')).toBe(0);
  });

  it('opens in the page outlet with host: page', () => {
    service.registerSideSheetOutlet('end', page);
    service.registerSideSheetOutlet('end', dialog, { level: 'dialog' });

    service.openSideSheet(TestSheet, { host: 'page' });

    expect(sheetsIn('.page')).toBe(1);
    expect(sheetsIn('.dialog')).toBe(0);
  });

  it('picks the page outlet registered last, even above a dialog', () => {
    service.registerSideSheetOutlet('end', page);
    service.registerSideSheetOutlet('end', dialog, { level: 'dialog' });
    service.registerSideSheetOutlet('end', page2);

    service.openSideSheet(TestSheet, { host: 'page' });

    expect(sheetsIn('.page-2')).toBe(1);
  });

  it('keeps closeExisting to the outlet the sheet opens in', () => {
    service.registerSideSheetOutlet('end', page);
    service.registerSideSheetOutlet('end', dialog, { level: 'dialog' });

    const dialogSheet = service.openSideSheet(TestSheet);
    let dialogSheetClosed = false;

    dialogSheet.afterClosed().subscribe(() => dialogSheetClosed = true);
    service.openSideSheet(TestSheet, { host: 'page', closeExisting: true });

    expect(dialogSheetClosed).toBeFalse();
    expect(sheetsIn('.dialog')).toBe(1);
  });

  it('keeps a page sheet open when the dialog outlet goes away', () => {
    service.registerSideSheetOutlet('end', page);
    service.registerSideSheetOutlet('end', dialog, { level: 'dialog' });

    service.openSideSheet(TestSheet, { host: 'page' });
    service.unregisterSideSheetOutlet('end', dialog);

    expect(sheetsIn('.page')).toBe(1);
  });

  it('refuses host: page when only a dialog outlet is registered', () => {
    service.registerSideSheetOutlet('end', dialog, { level: 'dialog' });

    expect(() => service.openSideSheet(TestSheet, { host: 'page' }))
      .toThrowError(/No available page end side sheet outlet/);
  });
});
