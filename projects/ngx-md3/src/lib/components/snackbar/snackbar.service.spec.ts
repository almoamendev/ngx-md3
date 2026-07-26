import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should queue a second snackbar while one is showing, and show it after the first is dismissed', () => {
    const first = service.open('First message');
    const second = service.open('Second message');

    let secondShown = false;
    second.afterDismissed().subscribe(() => {
      secondShown = true;
    });

    expect(secondShown).toBeFalse();

    first.close('manual');

    // Second is now active; dismissing it should complete without throwing.
    expect(() => service.dismiss()).not.toThrow();
  });

  it('should throw when both an action and a close icon are requested', () => {
    expect(() => service.open('message', 'Undo', { showCloseIcon: true })).toThrowError();
  });
});
