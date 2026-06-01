import { Component, ElementRef, booleanAttribute, computed, contentChild, contentChildren, effect, inject, input, model } from '@angular/core';
import { LayoutService } from '../../../foundations/layout.service';
import { IconElement } from '../../common/icon-element';
import { FloatingActionButton } from '../../buttons/floating-action-button/floating-action-button';

type ExpandedLayout = 'standard' | 'modal';
type CollapsedLayout = 'compact' | 'narrow' | 'hidden';
type ContainerStyle = 'none' | 'elevated' | 'divider';

@Component({
    standalone: false,
    selector: 'md3-navigation-rail',
    templateUrl: './navigation-rail.html',
    styleUrl: './navigation-rail.scss',
})
export class NavigationRail {
    private readonly el = inject(ElementRef<HTMLElement>);
    private readonly layoutService = inject(LayoutService);

    public expanded = model(false, {
        alias: 'expanded',
    });

    public hideMenuButton = input<boolean, unknown>(false, {
        alias: 'hide-menu-button',
        transform: booleanAttribute
    });

    public fullWidthIndicator = input<boolean, unknown>(false, {
        alias: 'full-width-indicator',
        transform: booleanAttribute
    });

    public containerStyle = input<ContainerStyle>('none', {
        alias: 'container-style',
    });

    public collapsedMode = input<CollapsedLayout>('compact', {
        alias: 'collapsed-layout',
    });

    public expandedMode = input<ExpandedLayout>('standard', {
        alias: 'expanded-layout',
    });

    private readonly resolvedCollapsedLayout = computed<CollapsedLayout>(() => {
        if (this.layoutService.widthClass() === 'compact') {
            return 'hidden';
        }

        return this.collapsedMode();
    });

    private readonly resolvedExpandedLayout = computed<ExpandedLayout>(() => {
        if (this.layoutService.widthClass() === 'compact') {
            return 'modal';
        }

        return this.expandedMode();
    });

    private menuIcons = contentChildren<IconElement>(IconElement);
    private floatingActionButton = contentChild<FloatingActionButton>(FloatingActionButton);

    public menuExpandIcon = computed(() => this.menuIcons().find((icon) => icon.iconType == 'expand'));
    public menuCollapseIcon = computed(() => this.menuIcons().find((icon) => icon.iconType == 'collapse'));
    public hasFab = computed(() => !!this.floatingActionButton());

    constructor() {
        effect((onCleanup) => {
            const containerStyle = this.containerStyle();
            if (containerStyle == 'none') {
                return;
            }

            const containerClass = 'md3-style-' + containerStyle;

            this.element.classList.add(containerClass);

            onCleanup(() => {
                this.element.classList.remove(containerClass);
            });
        });

        effect((onCleanup) => {
            const collapsed = this.resolvedCollapsedLayout();
            const collapsedClass = 'md3-collapsed-' + collapsed;

            this.element.classList.add(collapsedClass);

            onCleanup(() => {
                this.element.classList.remove(collapsedClass);
            });
        });
        
        effect((onCleanup) => {
            const expanded = this.resolvedExpandedLayout();
            const expandedClass = 'md3-expanded-' + expanded;

            this.element.classList.add(expandedClass);

            onCleanup(() => {
                this.element.classList.remove(expandedClass);
            });
        });

        effect(() => {
            if (this.expanded()) {
                this.element.classList.add('md3-expanded');
            } else {
                this.element.classList.remove('md3-expanded');
            }
        });

        effect(() => {
            const fab = this.floatingActionButton();
            if (!fab) {
                return;
            }

            fab.buttonSize.set('small');
            fab.isExtended.set(this.expanded());
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public toggle(): void {
        const isExpanded = !this.expanded();
        this.expanded.set(isExpanded);
    }

    public collapse(): void {
        this.expanded.set(false);
    }

    public expand(): void {
        this.expanded.set(true);
    }
}