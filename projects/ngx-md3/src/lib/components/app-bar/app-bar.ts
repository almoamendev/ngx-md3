import { booleanAttribute, Component, computed, contentChild, effect, ElementRef, input, Signal, signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { ButtonSize } from '../../types/button-size.type';
import { Avatar } from '../common/avatar';
import { LayoutService } from '../../foundations/layout.service';
import { AppBarLogo } from './app-bar-logo';

export type AppBarType = 'small' | 'medium' | 'large' | 'search';

@Component({
    standalone: false,
    selector: 'md3-app-bar',
    templateUrl: './app-bar.html',
    styleUrl: './app-bar.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: AppBar,
        },
    ],
    host: {
        role: 'banner',
        '[class.md3-scrolled]': 'mainIsScrolled()',
        '[class.md3-auto-hide]': 'autoHide()',
        '[class.md3-scrolling-down]': 'isScrollingDown()',
    },
})
export class AppBar implements ButtonContext {
    public title = input<string | null>(null, {
        alias: 'bar-title',
    });

    public subtitle = input<string | null>(null, {
        alias: 'bar-subtitle',
    });

    public appBarType = input<AppBarType>('small', {
        alias: 'bar-type',
    });
    
    public centerAligned = input<boolean, unknown>(false, {
        alias: 'center-aligned',
        transform: booleanAttribute,
    });

    public autoHide = input<boolean, unknown>(false, {
        alias: 'auto-hide',
        transform: booleanAttribute,
    });

    private logo = contentChild(AppBarLogo);
    private avatar = contentChild(Avatar);

    public hasLogo = computed(() => !!this.logo());
    public hasAvatar = computed(() => !!this.avatar());

    public mainIsScrolled = computed(() => this.layoutService.mainIsScrolled());
    public isScrollingDown = signal<boolean>(false);

    private scrollPosition = 0;
    private bottomExpandedHeight = computed(() => {
        const type = this.appBarType();

        if (!this.hasCollapsibleBottom(type)) {
            return 0;
        }

        this.layoutService.viewport();

        const fontSize = this.getHostFontSize();
        const hasSubtitle = !!this.subtitle()?.length;

        if (type === 'medium') {
            return (hasSubtitle ? 4.5 : 3) * fontSize;
        }

        return (hasSubtitle ? 5.5 : 3.5) * fontSize;
    });

    private bottomCollapse = computed(() => {
        const expandedHeight = this.bottomExpandedHeight();

        if (!expandedHeight) {
            return 0;
        }

        return Math.min(expandedHeight, Math.max(0, this.layoutService.mainScrollTop()));
    });

    // button context
    public buttonContextSize: Signal<ButtonSize> = signal('small');

    constructor(
        private el: ElementRef,
        private layoutService: LayoutService
    ) {
        this.scrollPosition = this.layoutService.mainScrollTop();

        effect((onCleanup) => {
            const type = 'md3-' + this.appBarType();

            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });

        effect((onCleanup) => {
            const width = 'md3-layout-' + this.layoutService.widthClass();
            this.element.classList.add(width);

            onCleanup(() => {
                this.element.classList.remove(width);
            });
        });

        effect(() => {
            this.updateScrollDirection(this.layoutService.mainScrollTop());
        });

        effect(() => {
            const collapse = this.bottomCollapse();
            const expandedHeight = this.bottomExpandedHeight();

            this.element.style.setProperty(
                '--app-bar-bottom-collapse',
                `${collapse}px`
            );
            this.element.style.setProperty(
                '--app-bar-bottom-opacity',
                this.getBottomOpacity(collapse, expandedHeight).toString()
            );
            this.element.classList.toggle(
                'md3-collapsed',
                this.isBottomCollapsed(collapse, expandedHeight)
            );
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    private getBottomOpacity(collapse: number, expandedHeight: number): number {
        if (!expandedHeight) {
            return 1;
        }

        return Math.max(0, Math.min(1, 1 - (collapse / expandedHeight)));
    }

    private isBottomCollapsed(collapse: number, expandedHeight: number): boolean {
        return expandedHeight > 0 && collapse >= expandedHeight;
    }

    private updateScrollDirection(scrollTop: number): void {
        if (scrollTop === this.scrollPosition) {
            return;
        }

        const defaultBarHeight = this.getHostFontSize() * 4;
        const scrollOffset = scrollTop - this.scrollPosition;

        if (Math.abs(scrollOffset) <= defaultBarHeight) {
            return;
        }

        this.isScrollingDown.set(scrollOffset > 0);
        this.scrollPosition = scrollTop;
    }

    private hasCollapsibleBottom(type: AppBarType): boolean {
        return (type === 'medium' || type === 'large') &&
            (!!this.title()?.length || !!this.subtitle()?.length);
    }

    private getHostFontSize(): number {
        if (typeof getComputedStyle === 'undefined') {
            return 16;
        }

        return Number.parseFloat(getComputedStyle(this.element).fontSize) || 16;
    }
}
