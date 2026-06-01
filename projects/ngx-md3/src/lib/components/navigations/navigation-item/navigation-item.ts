import { booleanAttribute, Component, computed, contentChildren, effect, ElementRef, HostBinding, inject, input } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { IconElement } from '../../common/icon-element';

@Component({
    selector: 'button[md3-nav-item], a[md3-nav-item]',
    imports: [],
    templateUrl: './navigation-item.html',
    styleUrl: './navigation-item.scss',
    hostDirectives: [
        RouterLinkActive
    ],
})
export class NavigationItem {
    private readonly el = inject(ElementRef<HTMLElement>);
    private routerLinkActive = inject(RouterLinkActive);
    
    public hideOnCollapse = input<boolean, unknown>(false, {
        alias: 'hide-on-collapse',
        transform: booleanAttribute
    });

    private icons = contentChildren<IconElement>(IconElement);

    public hasIcons = computed(() => this.icons()?.length != 0);

    @HostBinding('class.md3-active') get active(): boolean {
        return this.routerLinkActive.isActive;
    }

    constructor() {
        effect(() => {
            if (this.hideOnCollapse()) {
                this.element.classList.add('md3-hide-on-collapse');
            } else {
                this.element.classList.remove('md3-hide-on-collapse');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
