import { booleanAttribute, Component, computed, contentChild, contentChildren, ElementRef, HostBinding, inject, input } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { IconElement } from '../../common/icon-element';
import { Badge } from '../../common/badge';

@Component({
    selector: 'button[md3-nav-item], a[md3-nav-item]',
    exportAs: 'md3NavItem',
    imports: [],
    templateUrl: './navigation-item.html',
    styleUrl: './navigation-item.scss',
    host: {
        '[class.md3-hide-on-collapse]': 'hideOnCollapse()',
        '[class.md3-show-on-collapse]': 'showOnCollapse()',
    },
    hostDirectives: [
        {
            directive: RouterLinkActive,
            inputs: ['routerLinkActiveOptions', 'ariaCurrentWhenActive'],
        }
    ],
})
export class NavigationItem {
    private readonly el = inject(ElementRef<HTMLElement>);
    private routerLinkActive = inject(RouterLinkActive);
    
    public collapseMode = input<'none' | 'hide' | 'show'>('none', {
        alias: 'collapse-mode',
    });

    public hideOnCollapse = computed<boolean>(() => this.collapseMode() == 'hide');
    public showOnCollapse = computed<boolean>(() => this.collapseMode() == 'show');

    private icons = contentChildren<IconElement>(IconElement);

    public hasIcons = computed(() => this.icons()?.length != 0);

    public badge = contentChild<Badge>(Badge);

    public get isRouteActive(): boolean {
        return this.routerLinkActive.isActive;
    }

    @HostBinding('class.md3-active') get active(): boolean {
        return this.isRouteActive;
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
