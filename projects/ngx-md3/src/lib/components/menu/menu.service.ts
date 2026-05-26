import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ComponentRef, inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { MenuConfig } from '../../interfaces/menu-config.interface';
import { MENU_COMPONENT, MENU_CONFIG, MENU_DATA, MenuRef } from './menu-ref';
import { ComponentPortal } from '@angular/cdk/portal';
import { Menu } from './menu';
import { filter, take } from 'rxjs';

interface ResolvedMenuConfig<D = unknown> extends MenuConfig<D> {
    data: D | undefined;
    bindDataToInputs: boolean;
    menuColors: 'standard' | 'vibrant';
    viewContainerRef?: ViewContainerRef;
    injector: Injector;
}

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
        const overlayRef = this.createOverlay();
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
        this.startOpenAnimation(overlayRef);
        this.connectCloseEvents(overlayRef, menuRef);

        return menuRef;
    }

    private mergeConfig<D>(config: MenuConfig<D>): ResolvedMenuConfig<D> {
        return {
            data: config.data,
            bindDataToInputs: config.bindDataToInputs ?? false,
            menuColors: config.menuColors ?? 'standard',
            viewContainerRef: config.viewContainerRef,
            injector: config.injector ?? this.injector,
        };
    }

    private createOverlay(): OverlayRef {
        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: ['md3-menu-scrim', 'md3-menu-opening'],
            panelClass: ['md3-menu-panel', 'md3-menu-opening'],
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block(),
        });

        return this.overlay.create(overlayConfig);
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
