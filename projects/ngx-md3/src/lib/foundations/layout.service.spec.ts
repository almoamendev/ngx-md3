import { effect, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not re-run an effect that registers a floating bar', () => {
    // The toolbar registers from an effect, and the registration measures and writes the
    // inset. A tracked read of that signal inside the measurement made the effect depend on
    // what it writes, so it dirtied itself on every run and change detection never finished.
    const element = document.createElement('div');
    document.body.appendChild(element);

    let runs = 0;

    runInInjectionContext(TestBed.inject(Injector), () => {
      effect((onCleanup) => {
        runs++;
        service.registerFloatingBar(element, 'blockStart');
        onCleanup(() => service.unregisterFloatingBar(element));
      });
    });

    TestBed.tick();
    TestBed.tick();

    expect(runs).toBe(1);

    service.unregisterFloatingBar(element);
    element.remove();
  });
});
