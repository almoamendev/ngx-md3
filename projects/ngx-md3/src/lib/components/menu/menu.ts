import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { AfterContentInit, Component, ComponentRef, effect, ElementRef, inject, Injector, signal, Type, viewChild } from '@angular/core';
import { MenuConfig } from '../../interfaces/menu-config.interface';
import { MENU_CONFIG } from './menu-ref';

@Component({
    selector: 'md3-menu',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
    host: {
        'class': 'md3-menu-container',
        'role': 'menu',
        '[class.md3-visible]': 'isVisible()',
        '[class.md3-inactive]': '!isActive()',
    },
})
export class Menu implements AfterContentInit {
    private readonly portalOutlet = viewChild<CdkPortalOutlet>(CdkPortalOutlet);

    protected readonly config = inject<MenuConfig>(MENU_CONFIG, { optional: true }) ?? {};
    protected menuColors = signal<'standard' | 'vibrant'>('standard');
    protected isVisible = signal<boolean>(false);
    
    public isActive = signal<boolean>(true);
    
    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const color = 'md3-' + this.menuColors();
            this.element.classList.add(color);

            onCleanup(() => {
                this.element.classList.remove(color);
            });
        });

        this.menuColors.set(this.config.menuColors ?? 'standard');
    }

    ngAfterContentInit(): void {
        requestAnimationFrame(() => {
            this.showMenu(true);
        });
    }

    public showMenu(value: boolean): void {
        this.isVisible.set(value);
    }
    
    /**
     * The service creates this wrapper first, then calls this method to mount
     * the user supplied component into the dialog container.
     */
    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        const portal = new ComponentPortal(component, null, injector);

        return this.portalOutlet()!.attachComponentPortal(portal);
    }
}
