import { Component, ElementRef, Signal, booleanAttribute, computed, contentChild, contentChildren, effect, inject, input, model, signal } from '@angular/core';
import { LayoutService } from '../../../foundations/layout.service';
import { IconElement } from '../../common/icon-element';
import { FloatingActionButton } from '../../buttons/floating-action-button/floating-action-button';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';
import { ButtonSize } from '../../../types/button-size.type';

type ExpandedLayout = 'standard' | 'modal';
type CollapsedLayout = 'compact' | 'narrow' | 'hidden';
type ContainerStyle = 'none' | 'elevated' | 'divider';

@Component({
    standalone: false,
    selector: 'md3-navigation-rail',
    templateUrl: './navigation-rail.html',
    styleUrl: './navigation-rail.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: NavigationRail,
        },
    ],
    host: {
        '[class.md3-expanded]': 'this.expanded()',
    },
})
export class NavigationRail implements ButtonContext {
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
        if (this.layoutService.isCompact()) {
            return 'hidden';
        }

        return this.collapsedMode();
    });

    private readonly resolvedExpandedLayout = computed<ExpandedLayout>(() => {
        if (this.layoutService.isCompact()) {
            return 'modal';
        }

        return this.expandedMode();
    });

    private menuIcons = contentChildren<IconElement>(IconElement);
    private floatingActionButton = contentChild<FloatingActionButton>(FloatingActionButton);

    public menuExpandIcon = computed(() => this.menuIcons().find((icon) => icon.iconType() == 'expand'));
    public menuCollapseIcon = computed(() => this.menuIcons().find((icon) => icon.iconType() == 'collapse'));
    public hasFab = computed(() => !!this.floatingActionButton());
    
    // context values
    buttonContextSize: Signal<ButtonSize> = signal('small');
    buttonContextExtended: Signal<boolean> = this.expanded;

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
            const collapsed = 'md3-collapsed-' + this.resolvedCollapsedLayout();
            this.element.classList.add(collapsed);

            onCleanup(() => {
                this.element.classList.remove(collapsed);
            });
        });
        
        effect((onCleanup) => {
            const expanded = 'md3-expanded-' +  this.resolvedExpandedLayout();
            this.element.classList.add(expanded);

            onCleanup(() => {
                this.element.classList.remove(expanded);
            });
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