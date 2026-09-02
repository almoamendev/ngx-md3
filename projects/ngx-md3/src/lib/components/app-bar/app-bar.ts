import { booleanAttribute, Component, computed, contentChild, effect, ElementRef, inject, input, Signal, signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { ButtonSize } from '../../types/button-size.type';
import { Avatar } from '../common/avatar';
import { LayoutService } from '../../foundations/layout.service';
import { DIALOG_CONFIG } from '../dialog/dialog-ref';
import { AppBarLogo } from './app-bar-logo';
import { TypeDisplay, TypeHeadline, TypeTitle } from '../../../public-api';

export type AppBarType = 'small' | 'medium' | 'large' | 'search';
export type AppBarScrollingStyle = 'none' | 'transparent' | 'elevate';

@Component({
    selector: 'md3-app-bar',
    imports: [
        TypeHeadline,
        TypeTitle,
        TypeDisplay,
    ],
    templateUrl: './app-bar.html',
    styleUrl: './app-bar.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: AppBar,
        },
    ],
    host: {
        '[attr.role]': 'resolvedRole()',
        '[class.md3-scrolled]': 'mainIsScrolled()',
        '[class.md3-auto-hide]': 'autoHide()',
        '[class.md3-scrolling-down]': 'isScrollingDown()',
    },
})
export class AppBar implements ButtonContext {
    // A dialog provides its configuration to everything it holds, so this is how the bar knows
    // it is not the banner of the document.
    private readonly inDialog = !!inject(DIALOG_CONFIG, { optional: true });

    /**
     * The landmark role of the bar.
     *
     * A page has one banner, and the app bar of the page is it. A bar inside a dialog is not
     * the banner of the document — a banner nested in a dialog misleads a screen reader — so a
     * bar that finds itself in one carries no role. Set this input to force either value.
     */
    public barRole = input<'banner' | 'none' | null>(null, {
        alias: 'bar-role',
    });

    protected readonly resolvedRole = computed<string | null>(() => {
        const role = this.barRole();

        if (role !== null) {
            return role === 'none' ? null : role;
        }

        return this.inDialog ? null : 'banner';
    });

    public title = input<string | null>(null, {
        alias: 'bar-title',
    });

    public subtitle = input<string | null>(null, {
        alias: 'bar-subtitle',
    });

    public appBarType = input<AppBarType>('small', {
        alias: 'bar-type',
    });

    public appBarScrollingStyle = input<AppBarScrollingStyle>('elevate', {
        alias: 'scroll-style',
    });

    public autoHide = input<boolean, unknown>(false, {
        alias: 'auto-hide',
        transform: booleanAttribute,
    });
    
    public centerAligned = input<boolean, unknown>(false, {
        alias: 'center-aligned',
        transform: booleanAttribute,
    });

    private logo = contentChild(AppBarLogo);
    private avatar = contentChild(Avatar);

    public hasLogo = computed(() => !!this.logo());
    public hasAvatar = computed(() => !!this.avatar());

    public mainIsScrolled = computed(() => this.layoutService.mainIsScrolled());

    // One source of truth. The toolbar reads the same signal, so the two bars can never
    // disagree about which way the main pane is moving.
    public isScrollingDown = computed<boolean>(() => this.layoutService.isScrollingDown());

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
        effect((onCleanup) => {
            const type = 'md3-' + this.appBarType();

            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });

        effect((onCleanup) => {
            const scrollingStyle = 'md3-scroll-style-' + this.appBarScrollingStyle();

            this.element.classList.add(scrollingStyle);

            onCleanup(() => {
                this.element.classList.remove(scrollingStyle);
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
