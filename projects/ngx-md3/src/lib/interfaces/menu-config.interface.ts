import { ConnectedPosition, FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { Injector, ViewContainerRef } from '@angular/core';

export type MenuPositionX = 'start' | 'end' | 'before' | 'after' | 'center';
export type MenuPositionY = 'above' | 'below' | 'center';
export type MenuScrollStrategy = 'reposition' | 'block' | 'close' | 'noop';
export type MenuPositionOrigin = FlexibleConnectedPositionStrategyOrigin | MouseEvent;

export interface MenuConfig<D = unknown> {
    /**
     * Optional data passed to the component opened inside the menu.
     * The dynamic component can read it by injecting MENU_DATA.
     */
    data?: D;

    /**
     * When enabled, object keys from data are also assigned to matching inputs
     * on the dynamic component through Angular's setInput API.
     */
    bindDataToInputs?: boolean;
    menuColors?: 'standard' | 'vibrant';

    /**
     * Element or point the menu should open from. If omitted, the service uses
     * the currently focused element, which usually is the trigger button.
     */
    origin?: MenuPositionOrigin;

    /**
     * Horizontal alignment against the origin.
     * start/end align edges, before/after place the menu beside the origin.
     */
    xPosition?: MenuPositionX;

    /**
     * Vertical alignment against the origin.
     */
    yPosition?: MenuPositionY;

    /**
     * Keep the menu on top of the trigger instead of opening outside it.
     */
    overlapTrigger?: boolean;

    /**
     * Additional pixel offsets from the resolved connected position.
     */
    offsetX?: number;
    offsetY?: number;

    /**
     * Distance in pixels the menu should keep from the viewport edge.
     * Values below 0.5em are raised to 0.5em.
     */
    viewportMargin?: number;

    /**
     * Custom CDK connected positions. When provided, these replace the default
     * Material-style fallback positions.
     */
    positions?: ConnectedPosition[];

    /**
     * How the menu reacts when the page scrolls.
     */
    scrollStrategy?: MenuScrollStrategy;
    
    /**
     * Menu scheme colors
     * @default inherit
     */
    scheme?: 'inherit' | 'dark' | 'light';
    
    /**
     * Menu direction. when null the direction will depends on default page direction.
     * @default null
     */
    direction?: null | 'ltr' | 'rtl';

    /**
     * Size of the menu, as a factor of 1rem: sets `--md3-scale` on its panel. `inherit` copies
     * the scale of the element the menu opens from, so a menu matches a scaled trigger.
     * When omitted, the menu follows the `--md3-scale` of the root.
     * @default undefined — `inherit` for a submenu and for a select field's options
     */
    scale?: number | 'inherit';

    /**
     * Optional Angular context for the dynamic component. Passing a
     * ViewContainerRef keeps dependency lookup close to the caller.
     */
    viewContainerRef?: ViewContainerRef;

    /**
     * Optional Angular injector used when creating the menu component.
     */
    injector?: Injector;
}
