import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { AfterContentInit, Component, ComponentRef, effect, ElementRef, inject, Injector, Input, signal, Type, ViewChild } from '@angular/core';
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
    },
})
export class Menu implements AfterContentInit {
    @ViewChild(CdkPortalOutlet, { static: true })
    private readonly portalOutlet!: CdkPortalOutlet;

    protected readonly config = inject<MenuConfig>(MENU_CONFIG, { optional: true }) ?? {};

    private menuColors = signal<'standard' | 'vibrant'>('standard');
    private isVisible = signal<boolean>(false);

    public isActive = signal<boolean>(true);
    
    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    constructor(private el: ElementRef) {
        effect(() => {
            const color = this.menuColors();
            this.element.classList.add('md3-' + color);
        });

        effect(() => {
            if (this.isActive()) {
                this.element.classList.remove('md3-inactive');
            } else {
                this.element.classList.add('md3-inactive');
            }
        });

        effect(() => {
            if (this.isVisible()) {
                this.element.classList.add('md3-active');
            } else {
                this.element.classList.remove('md3-active');
            }
        });

        if (this.config.menuColors == 'vibrant') {
            this.setColors('vibrant');
        }
    }

    ngAfterContentInit(): void {
        setTimeout(() => {
            this.showMenu(true);
        }, 10);
    }

    public showMenu(value: boolean): void {
        this.isVisible.set(value);
    }

    public setColors(value: 'standard' | 'vibrant'): void {
        this.menuColors.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    }
    
    /**
     * The service creates this wrapper first, then calls this method to mount
     * the user supplied component into the dialog container.
     */
    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        const portal = new ComponentPortal(component, null, injector);

        return this.portalOutlet.attachComponentPortal(portal);
    }
}
