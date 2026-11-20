import { TestBed } from '@angular/core/testing';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { SheetOutletHandler, SheetOutletRegistry } from './sheet-outlet-registry';

describe('SheetOutletRegistry', () => {
  let registry: SheetOutletRegistry;
  const outletA = {} as CdkPortalOutlet;
  const outletB = {} as CdkPortalOutlet;

  function handler(): jasmine.SpyObj<SheetOutletHandler> {
    return jasmine.createSpyObj<SheetOutletHandler>('handler', ['register', 'unregister']);
  }

  beforeEach(() => {
    registry = TestBed.inject(SheetOutletRegistry);
  });

  it('replays outlets registered before a handler connects, in order', () => {
    registry.register('end', outletA);
    registry.register('end', outletB, { level: 'dialog' });
    registry.register('start', outletA);

    const end = handler();
    registry.connect('end', end);

    expect(end.register.calls.allArgs()).toEqual([
      [outletA, {}],
      [outletB, { level: 'dialog' }],
    ]);
  });

  it('forwards changes to the connected handler and ignores duplicates', () => {
    const bottom = handler();
    registry.connect('bottom', bottom);

    registry.register('bottom', outletA);
    registry.register('bottom', outletA);
    registry.unregister('bottom', outletA);
    registry.unregister('bottom', outletA);

    expect(bottom.register).toHaveBeenCalledTimes(1);
    expect(bottom.unregister).toHaveBeenCalledOnceWith(outletA);
  });

  it('does not replay outlets that were unregistered before connecting', () => {
    registry.register('start', outletA);
    registry.unregister('start', outletA);

    const start = handler();
    registry.connect('start', start);

    expect(start.register).not.toHaveBeenCalled();
  });
});
