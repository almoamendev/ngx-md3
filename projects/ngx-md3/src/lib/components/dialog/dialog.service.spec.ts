import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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
});
