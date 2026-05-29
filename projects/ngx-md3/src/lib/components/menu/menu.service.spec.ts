import { TestBed } from '@angular/core/testing';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import type { MenuPositionX, MenuPositionY, MenuScrollStrategy } from '../../interfaces/menu-config.interface';

import { MenuService } from './menu.service';

type TestMenuPositionConfig = {
  bindDataToInputs: boolean;
  isSubMenu: boolean;
  menuColors: 'standard' | 'vibrant';
  xPosition: MenuPositionX;
  yPosition: MenuPositionY;
  overlapTrigger: boolean;
  offsetX: number;
  offsetY: number;
  viewportMargin: number;
  scrollStrategy: MenuScrollStrategy;
};

type TestClientRect = Pick<
  DOMRectReadOnly,
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y'
>;

type MenuServicePositionInternals = {
  getInitialConnectedPositions(config: TestMenuPositionConfig): ConnectedPosition[];
  getFallbackPositionAfterPush(
    config: TestMenuPositionConfig,
    originRect: TestClientRect,
    overlayRect: TestClientRect,
  ): ConnectedPosition | null;
};

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with only the preferred position so push runs before fallbacks', () => {
    const positions = getPositionInternals(service).getInitialConnectedPositions(
      createPositionConfig(),
    );

    expect(getPositionClassGroups(positions)).toEqual([
      ['md3-menu-position-start', 'md3-menu-position-below'],
    ]);
  });

  it('should keep a pushed position while the anchor relationship is still close', () => {
    const fallbackPosition = getPositionInternals(service).getFallbackPositionAfterPush(
      createPositionConfig(),
      createRect({ top: 76, left: 100, width: 40, height: 24 }),
      createRect({ top: 94, left: 100, width: 160, height: 120 }),
    );

    expect(fallbackPosition).toBeNull();
  });

  it('should flip vertically when push pulls a below menu too far across the anchor', () => {
    const fallbackPosition = getPositionInternals(service).getFallbackPositionAfterPush(
      createPositionConfig(),
      createRect({ top: 76, left: 100, width: 40, height: 24 }),
      createRect({ top: 80, left: 100, width: 160, height: 120 }),
    );

    expect(getPositionClasses(fallbackPosition)).toEqual([
      'md3-menu-position-start',
      'md3-menu-position-above',
    ]);
  });

  it('should flip submenus horizontally when push pulls them too far over the trigger', () => {
    const fallbackPosition = getPositionInternals(service).getFallbackPositionAfterPush(
      createPositionConfig({ isSubMenu: true, xPosition: 'after', offsetY: 0 }),
      createRect({ top: 100, left: 80, width: 40, height: 32 }),
      createRect({ top: 100, left: 100, width: 160, height: 120 }),
    );

    expect(getPositionClasses(fallbackPosition)).toEqual([
      'md3-menu-position-before',
      'md3-menu-position-below',
      'md3-menu-position-submenu',
    ]);
  });
});

function getPositionInternals(service: MenuService): MenuServicePositionInternals {
  return service as unknown as MenuServicePositionInternals;
}

function createPositionConfig(
  config: Partial<TestMenuPositionConfig> = {},
): TestMenuPositionConfig {
  return {
    bindDataToInputs: false,
    isSubMenu: false,
    menuColors: 'standard',
    xPosition: 'start',
    yPosition: 'below',
    overlapTrigger: false,
    offsetX: 0,
    offsetY: 4,
    viewportMargin: 8,
    scrollStrategy: 'reposition',
    ...config,
  };
}

function createRect(
  rect: Pick<TestClientRect, 'height' | 'left' | 'top' | 'width'>,
): TestClientRect {
  return {
    x: rect.left,
    y: rect.top,
    top: rect.top,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getPositionClassGroups(positions: ConnectedPosition[]): string[][] {
  return positions.map((position) => getPositionClasses(position));
}

function getPositionClasses(position: ConnectedPosition | null): string[] {
  const panelClass = position?.panelClass;

  if (!panelClass) {
    return [];
  }

  return Array.isArray(panelClass) ? panelClass : [panelClass];
}
