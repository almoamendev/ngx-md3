import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BottomSheetService } from './bottom-sheet.service';

@Component({
  selector: 'md3-test-sheet',
  template: '',
})
class TestSheet {
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
      .toThrowError(/No bottom sheet outlet is registered/);
  });
});
