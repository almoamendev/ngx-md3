import {
    ConnectedPosition,
    FlexibleConnectedPositionStrategyOrigin,
    Overlay,
    OverlayConfig,
    OverlayRef,
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ComponentRef, ElementRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { MenuConfig, MenuPositionOrigin, MenuPositionX, MenuPositionY, MenuScrollStrategy } from '../../interfaces/menu-config.interface';
import { MENU_COMPONENT, MENU_CONFIG, MENU_DATA, MenuRef } from './menu-ref';
import { ComponentPortal } from '@angular/cdk/portal';
import { Menu } from './menu';
import { filter, take } from 'rxjs';

interface ResolvedMenuConfig<D = unknown> extends MenuConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    menuColors: 'standard' | 'vibrant';
    xPosition: MenuPositionX;
    yPosition: MenuPositionY;
    overlapTrigger: boolean;
    offsetX: number;
    offsetY: number;
    viewportMargin: number;
    positions?: ConnectedPosition[];
    scrollStrategy: MenuScrollStrategy;
    viewContainerRef?: ViewContainerRef;
    injector: Injector;
}

type SubMenuPositionX = Extract<MenuPositionX, 'before' | 'after'>;
type SubMenuVerticalAlignment = 'top' | 'bottom';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private readonly overlay = inject(Overlay);
    private readonly injector = inject(Injector);
    private readonly document = inject(DOCUMENT);

    public open<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: MenuConfig<D> = {},
    ): MenuRef<T, R> {
        const menuConfig = this.mergeConfig(config);
        const previouslyFocusedElement = this.getFocusedElement();
        const triggerElement = this.resolveTriggerElement(menuConfig.origin, previouslyFocusedElement);
        const overlayRef = this.createOverlay(menuConfig, previouslyFocusedElement);
        const menuRef = new MenuRef<T, R>(
            overlayRef,
            previouslyFocusedElement
        );
        const injector = this.createInjector(component, menuConfig, menuRef);

        // The overlay hosts the MD3 menu shell. The shell is responsible for
        // the surface markup and receives the dynamic content through a portal.
        const menuPortal = new ComponentPortal(
            Menu,
            menuConfig.viewContainerRef ?? null,
            injector,
        );
        const menuComponentRef = overlayRef.attach(menuPortal);
        const contentComponentRef = menuComponentRef.instance.attachContent(component, injector);

        this.bindDataToInputs(contentComponentRef, menuConfig);
        menuRef.componentInstance = contentComponentRef.instance;
        menuRef.menuInstance = menuComponentRef.instance;
        this.bindTriggerActiveState(triggerElement, overlayRef, menuRef);
        this.startOpenAnimation(overlayRef);
        this.connectCloseEvents(overlayRef, menuRef);

        return menuRef;
    }

    public openSubMenu<T, D = unknown, R = unknown>(
        component: Type<T>,
        config: MenuConfig<D> = {},
    ): MenuRef<T, R> {
        const xPosition = this.getSubMenuXPosition(config.xPosition);
        const yPosition = config.yPosition ?? 'below';
        const offsetX = config.offsetX ?? 0;
        const offsetY = config.offsetY ?? 0;

        return this.open<T, D, R>(component, {
            ...config,
            xPosition,
            yPosition,
            overlapTrigger: config.overlapTrigger ?? true,
            offsetX,
            offsetY,
            positions: config.positions ?? this.getSubMenuConnectedPositions(
                xPosition,
                yPosition,
                offsetX,
                offsetY,
            ),
        });
    }

    private mergeConfig<D>(config: MenuConfig<D>): ResolvedMenuConfig<D> {
        return {
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            menuColors: config.menuColors ?? 'standard',
            xPosition: config.xPosition ?? 'start',
            yPosition: config.yPosition ?? 'below',
            overlapTrigger: config.overlapTrigger ?? false,
            offsetX: config.offsetX ?? 0,
            offsetY: config.offsetY ?? 4,
            viewportMargin: config.viewportMargin ?? 8,
            positions: config.positions,
            scrollStrategy: config.scrollStrategy ?? 'reposition',
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    private createOverlay(
        config: ResolvedMenuConfig,
        fallbackOrigin: HTMLElement | null,
    ): OverlayRef {
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(this.resolveOrigin(config.origin, fallbackOrigin))
            .withFlexibleDimensions(false)
            .withGrowAfterOpen(true)
            .withPush(true)
            .withViewportMargin(config.viewportMargin)
            .withPositions(config.positions ?? this.getConnectedPositions(config))
            .withTransformOriginOn('.md3-menu-container');

        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: ['md3-menu-scrim', 'md3-menu-opening'],
            panelClass: ['md3-menu-panel', 'md3-menu-opening'],
            positionStrategy,
            scrollStrategy: this.getScrollStrategy(config.scrollStrategy),
        });

        return this.overlay.create(overlayConfig);
    }

    private bindTriggerActiveState<T, R>(
        triggerElement: HTMLElement | null,
        overlayRef: OverlayRef,
        menuRef: MenuRef<T, R>,
    ): void {
        if (!triggerElement) {
            return;
        }

        const removeActiveClass = () => triggerElement.classList.remove('md3-menu-active');

        triggerElement.classList.add('md3-menu-active');
        menuRef.afterClosed().pipe(take(1)).subscribe(removeActiveClass);
        overlayRef.detachments().pipe(take(1)).subscribe(removeActiveClass);
    }

    private resolveOrigin(
        origin: MenuPositionOrigin | undefined,
        fallbackOrigin: HTMLElement | null,
    ): FlexibleConnectedPositionStrategyOrigin {
        const resolvedOrigin = origin ?? fallbackOrigin;

        if (resolvedOrigin) {
            if (this.isMouseEvent(resolvedOrigin)) {
                if (resolvedOrigin.currentTarget instanceof HTMLElement) {
                    return resolvedOrigin.currentTarget;
                }

                return {
                    x: resolvedOrigin.clientX,
                    y: resolvedOrigin.clientY,
                };
            }

            if (this.isElementRef(resolvedOrigin)) {
                return resolvedOrigin.nativeElement;
            }

            return resolvedOrigin;
        }

        const viewport = this.document.defaultView;

        return {
            x: (viewport?.innerWidth ?? 0) / 2,
            y: (viewport?.innerHeight ?? 0) / 2,
        };
    }

    private resolveTriggerElement(
        origin: MenuPositionOrigin | undefined,
        fallbackOrigin: HTMLElement | null,
    ): HTMLElement | null {
        const resolvedOrigin = origin ?? fallbackOrigin;

        if (!resolvedOrigin) {
            return null;
        }

        if (this.isMouseEvent(resolvedOrigin)) {
            return resolvedOrigin.currentTarget instanceof HTMLElement
                ? resolvedOrigin.currentTarget
                : null;
        }

        if (this.isElementRef(resolvedOrigin)) {
            return resolvedOrigin.nativeElement;
        }

        return resolvedOrigin instanceof HTMLElement ? resolvedOrigin : null;
    }

    private getConnectedPositions(config: ResolvedMenuConfig): ConnectedPosition[] {
        const preferredX = config.xPosition;
        const fallbackX = this.getFallbackXPosition(preferredX);
        const preferredY = config.yPosition;
        const fallbackY = this.getFallbackYPosition(preferredY);

        return [
            this.createConnectedPosition(preferredX, preferredY, config),
            this.createConnectedPosition(preferredX, fallbackY, config),
            this.createConnectedPosition(fallbackX, preferredY, config),
            this.createConnectedPosition(fallbackX, fallbackY, config),
        ];
    }

    private getSubMenuConnectedPositions(
        xPosition: SubMenuPositionX,
        yPosition: MenuPositionY,
        offsetX: number,
        offsetY: number,
    ): ConnectedPosition[] {
        const fallbackX = this.getFallbackXPosition(xPosition) as SubMenuPositionX;
        const preferredY = this.getSubMenuVerticalAlignment(yPosition);
        const fallbackY = this.getFallbackSubMenuVerticalAlignment(preferredY);

        return [
            this.createSubMenuConnectedPosition(xPosition, preferredY, offsetX, offsetY),
            this.createSubMenuConnectedPosition(xPosition, fallbackY, offsetX, offsetY),
            this.createSubMenuConnectedPosition(fallbackX, preferredY, offsetX, offsetY),
            this.createSubMenuConnectedPosition(fallbackX, fallbackY, offsetX, offsetY),
        ];
    }

    private createConnectedPosition(
        xPosition: MenuPositionX,
        yPosition: MenuPositionY,
        config: ResolvedMenuConfig,
    ): ConnectedPosition {
        const horizontal = this.getHorizontalPosition(xPosition);
        const vertical = this.getVerticalPosition(yPosition, config.overlapTrigger);

        return {
            ...horizontal,
            ...vertical,
            offsetX: config.offsetX,
            offsetY: this.getOffsetY(yPosition, config),
            panelClass: [
                'md3-menu-position-' + xPosition,
                'md3-menu-position-' + yPosition,
            ],
        };
    }

    private createSubMenuConnectedPosition(
        xPosition: SubMenuPositionX,
        yAlignment: SubMenuVerticalAlignment,
        offsetX: number,
        offsetY: number,
    ): ConnectedPosition {
        const horizontal = this.getHorizontalPosition(xPosition);
        const yPosition = yAlignment === 'top' ? 'below' : 'above';

        return {
            ...horizontal,
            originY: yAlignment,
            overlayY: yAlignment,
            offsetX: this.getSubMenuOffsetX(xPosition, offsetX),
            offsetY: this.getSubMenuOffsetY(yAlignment, offsetY),
            panelClass: [
                'md3-menu-position-' + xPosition,
                'md3-menu-position-' + yPosition,
                'md3-menu-position-submenu',
            ],
        };
    }

    private getHorizontalPosition(position: MenuPositionX): Pick<ConnectedPosition, 'originX' | 'overlayX'> {
        switch (position) {
            case 'end':
                return {
                    originX: 'end',
                    overlayX: 'end',
                };

            case 'before':
                return {
                    originX: 'start',
                    overlayX: 'end',
                };

            case 'after':
                return {
                    originX: 'end',
                    overlayX: 'start',
                };

            case 'center':
                return {
                    originX: 'center',
                    overlayX: 'center',
                };

            case 'start':
            default:
                return {
                    originX: 'start',
                    overlayX: 'start',
                };
        }
    }

    private getVerticalPosition(
        position: MenuPositionY,
        overlapTrigger: boolean,
    ): Pick<ConnectedPosition, 'originY' | 'overlayY'> {
        switch (position) {
            case 'above':
                return {
                    originY: 'top',
                    overlayY: overlapTrigger ? 'top' : 'bottom',
                };

            case 'center':
                return {
                    originY: 'center',
                    overlayY: 'center',
                };

            case 'below':
            default:
                return {
                    originY: 'bottom',
                    overlayY: overlapTrigger ? 'bottom' : 'top',
                };
        }
    }

    private getFallbackXPosition(position: MenuPositionX): MenuPositionX {
        switch (position) {
            case 'start':
                return 'end';

            case 'end':
                return 'start';

            case 'before':
                return 'after';

            case 'after':
                return 'before';

            case 'center':
            default:
                return 'center';
        }
    }

    private getSubMenuXPosition(position: MenuPositionX | undefined): SubMenuPositionX {
        return position === 'before' ? 'before' : 'after';
    }

    private getFallbackYPosition(position: MenuPositionY): MenuPositionY {
        switch (position) {
            case 'above':
                return 'below';

            case 'below':
                return 'above';

            case 'center':
            default:
                return 'center';
        }
    }

    private getSubMenuVerticalAlignment(position: MenuPositionY): SubMenuVerticalAlignment {
        return position === 'above' ? 'bottom' : 'top';
    }

    private getFallbackSubMenuVerticalAlignment(
        alignment: SubMenuVerticalAlignment,
    ): SubMenuVerticalAlignment {
        return alignment === 'top' ? 'bottom' : 'top';
    }

    private getOffsetY(position: MenuPositionY, config: ResolvedMenuConfig): number {
        if (config.overlapTrigger || position === 'center') {
            return 0;
        }

        return position === 'above'
            ? config.offsetY * -1
            : config.offsetY;
    }

    private getSubMenuOffsetX(position: SubMenuPositionX, offsetX: number): number {
        return position === 'before' ? offsetX * -1 : offsetX;
    }

    private getSubMenuOffsetY(
        alignment: SubMenuVerticalAlignment,
        offsetY: number,
    ): number {
        return alignment === 'bottom' ? offsetY * -1 : offsetY;
    }

    private getScrollStrategy(scrollStrategy: MenuScrollStrategy) {
        switch (scrollStrategy) {
            case 'block':
                return this.overlay.scrollStrategies.block();

            case 'close':
                return this.overlay.scrollStrategies.close();

            case 'noop':
                return this.overlay.scrollStrategies.noop();

            case 'reposition':
            default:
                return this.overlay.scrollStrategies.reposition();
        }
    }

    private isMouseEvent(origin: MenuPositionOrigin | HTMLElement): origin is MouseEvent {
        return typeof MouseEvent !== 'undefined' && origin instanceof MouseEvent;
    }

    private isElementRef(origin: Exclude<MenuPositionOrigin, MouseEvent>): origin is ElementRef<HTMLElement> {
        return typeof origin === 'object'
            && origin !== null
            && 'nativeElement' in origin
            && origin.nativeElement instanceof HTMLElement;
    }

    private startOpenAnimation(overlayRef: OverlayRef): void {
        const panel = overlayRef.overlayElement;
        const backdrop = overlayRef.backdropElement;

        // The overlay is inserted already rendered. Keep an initial class for
        // one frame, force style calculation, then remove it so CSS transitions
        // have a real from/to state.
        requestAnimationFrame(() => {
            setTimeout(() => {
                panel.getBoundingClientRect();
                panel.classList.remove('md3-menu-opening');
                backdrop?.classList.remove('md3-menu-opening');
            }, 100);
        });
    }

    private createInjector<T, D, R>(
        component: Type<T>,
        config: ResolvedMenuConfig<D>,
        menuRef: MenuRef<T, R>,
    ): Injector {
        return Injector.create({
            parent: config.injector,
            providers: [
                // These tokens make the menu controllable from the dynamic
                // component without coupling that component to the service.
                { provide: MenuRef, useValue: menuRef },
                { provide: MENU_DATA, useValue: config.data },
                { provide: MENU_CONFIG, useValue: config },
                { provide: MENU_COMPONENT, useValue: component },
            ],
        });
    }

    private bindDataToInputs<T, D>(
        componentRef: ComponentRef<T>,
        config: ResolvedMenuConfig<D>,
    ): void {
        if (!config.bindDataToInputs || !this.canBindDataToInputs(config.data)) {
            return;
        }

        // setInput runs Angular's normal input pipeline, so input setters,
        // transforms, signal inputs, and change detection are handled for us.
        Object.entries(config.data).forEach(([inputName, inputValue]) => {
            componentRef.setInput(inputName, inputValue);
        });
    }

    private connectCloseEvents<T, R>(
        overlayRef: OverlayRef,
        menuRef: MenuRef<T, R>,
    ): void {
        overlayRef.backdropClick().pipe(take(1)).subscribe(() => menuRef.close());
        overlayRef.keydownEvents().pipe(
            filter((event) => event.key === 'Escape'),
            take(1),
        ).subscribe(() => menuRef.close());
    }

    private getFocusedElement(): HTMLElement | null {
        const activeElement = this.document.activeElement;
        return activeElement instanceof HTMLElement ? activeElement : null;
    }

    private canBindDataToInputs(data: unknown): data is Record<string, unknown> {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    }
}
