import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

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

  it('should queue a second snackbar while one is showing, and show it after the first is dismissed', async () => {
    const first = service.open('First message');
    const second = service.open('Second message');

    let secondShown = false;
    second.afterDismissed().subscribe(() => {
      secondShown = true;
    });

    expect(secondShown).toBeFalse();

    // close() waits for the exit animation (or a fallback timer) before it
    // actually emits on afterDismissed(), so the dismissal has to be awaited
    // here — otherwise that timer fires later, after this test (and its
    // TestBed environment) has already torn down, and take down whichever
    // test happens to be running at that point.
    const firstDismissed = firstValueFrom(first.afterDismissed());
    first.close('manual');
    await firstDismissed;

    // Second is now active; dismissing it should complete without throwing.
    const secondDismissed = firstValueFrom(second.afterDismissed());
    expect(() => service.dismiss()).not.toThrow();
    await secondDismissed;

    expect(secondShown).toBeTrue();
  });

  it('should throw when both an action and a close icon are requested', () => {
    expect(() => service.open('message', 'Undo', { showCloseIcon: true })).toThrowError();
  });
});
