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

    private logo = contentChild(AppBarLogo);
    private avatar = contentChild(Avatar);

    public hasLogo = computed(() => !!this.logo());
    public hasAvatar = computed(() => !!this.avatar());

    public mainIsScrolled = computed(() => this.layout.mainIsScrolled());
    private bottomCollapse = computed(() => {
        const type = this.appBarType();

        if (type !== 'medium' && type !== 'large') {
            return 0;
        }

        return Math.max(0, this.layout.mainScrollTop());
    });

    // button context
    public buttonContextSize: Signal<ButtonSize> = signal('small');

    constructor(
        private el: ElementRef,
        private layout: LayoutService
    ) {
        effect((onCleanup) => {
            const type = this.appBarType();

            this.element.classList.add('md3-' + type);

            onCleanup(() => {
                this.element.classList.remove('md3-' + type);
            });
        });

        effect(() => {
            const collapse = this.bottomCollapse();

            this.element.style.setProperty(
                '--app-bar-bottom-collapse',
                `${collapse}px`
            );
            this.element.style.setProperty(
                '--app-bar-bottom-opacity',
                this.getBottomOpacity(collapse).toString()
            );
            this.element.classList.toggle(
                'md3-collapsed',
                this.isBottomCollapsed(collapse)
            );
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    private getBottomOpacity(collapse: number): number {
        const type = this.appBarType();

        if (type !== 'medium' && type !== 'large') {
            return 1;
        }

        const expandedHeight = this.getBottomExpandedHeight();

        if (!expandedHeight) {
            return 1;
        }

        return Math.max(0, Math.min(1, 1 - (collapse / expandedHeight)));
    }

    private isBottomCollapsed(collapse: number): boolean {
        const type = this.appBarType();

        if (type !== 'medium' && type !== 'large') {
            return false;
        }

        if (!this.title()?.length && !this.subtitle()?.length) {
            return false;
        }

        const expandedHeight = this.getBottomExpandedHeight();

        return expandedHeight > 0 && collapse >= expandedHeight;
    }

    private getBottomExpandedHeight(): number {
        const fontSize = Number.parseFloat(getComputedStyle(this.element).fontSize) || 16;
        const hasSubtitle = !!this.subtitle()?.length;

        if (this.appBarType() === 'medium') {
            return (hasSubtitle ? 4.5 : 3) * fontSize;
        }

        if (this.appBarType() === 'large') {
            return (hasSubtitle ? 5.5 : 3.5) * fontSize;
        }

        return 0;
    }
}
