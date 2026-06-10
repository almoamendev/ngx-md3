import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, startWith, Subscription } from 'rxjs';
import { ViewportWidth } from '../types/viewport-width.type';
import { ViewportHeight } from '../types/viewport-height.type';

export type Md3NavigationMode = 'none' | 'navigation-bar' | 'navigation-rail' | 'standard-drawer' | 'modal-drawer';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private readonly document = inject(DOCUMENT);
    private readonly breakpointObserver = inject(BreakpointObserver);

    private readonly widthQueries: Record<ViewportWidth, string> = {
        'compact': '(max-width: 37.499em)', // < 600
        'medium': '(min-width: 37.5em) and (max-width: 52.499em)', // 600-839
        'expanded': '(min-width: 52.5em) and (max-width: 74.999em)', // 840-1199
        'large': '(min-width: 75em) and (max-width: 99.999em)', // 1200-1599
        'extra-large': '(min-width: 100em)' // >=1600
    } as const;

    private readonly heightQueries: Record<ViewportHeight, string> = {
        'compact': '(max-height: 29.999em)',
        'medium': '(min-height: 30em) and (max-height: 56.249em)',
        'expanded': '(min-height: 56.25em)'
    } as const;

    private mainPaneSub?: Subscription;

    readonly mainScrollTop = signal<number>(0);
    readonly mainIsScrolled = computed<boolean>(() => this.mainScrollTop() > 0);

    public readonly viewport = toSignal(
        fromEvent(window, 'resize').pipe(
            startWith(null),
            map(() => ({
                width: window.innerWidth,
                height: window.innerHeight
            }))
        ),
        {
            initialValue: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
    );

    public readonly widthClass = toSignal(
        this.breakpointObserver.observe(Object.values(this.widthQueries)).pipe(
            map((state): ViewportWidth => {
                if (state.breakpoints[this.widthQueries.compact]) {
                    return 'compact';
                }

                if (state.breakpoints[this.widthQueries.medium]) {
                    return 'medium';
                }

                if (state.breakpoints[this.widthQueries.expanded]) {
                    return 'expanded';
                }

                if (state.breakpoints[this.widthQueries.large]) {
                    return 'large';
                }

                return 'extra-large';
            })
        ),
        { initialValue: 'expanded' as ViewportWidth }
    );

    public readonly heightClass = toSignal(
        this.breakpointObserver.observe(Object.values(this.heightQueries)).pipe(
            map((state): ViewportHeight => {
                if (state.breakpoints[this.heightQueries.compact]) {
                    return 'compact';
                }

                if (state.breakpoints[this.heightQueries.medium]) {
                    return 'medium';
                }

                return 'expanded';
            })
        ),
        { initialValue: 'expanded' as ViewportHeight }
    );

    public readonly direction = signal<'ltr' | 'rtl'>(
        (this.document.documentElement.dir as 'ltr' | 'rtl') || 'ltr'
    );

    public readonly isCompact = computed(() => this.widthClass() === 'compact');
    public readonly isMedium = computed(() => this.widthClass() === 'medium');
    public readonly isExpanded = computed(() => this.widthClass() === 'expanded');
    public readonly isLarge = computed(() => this.widthClass() === 'large');
    public readonly isExtraLarge = computed(() => this.widthClass() === 'extra-large');

    public readonly isPortrait = computed(() => {
        const viewport = this.viewport();
        return viewport.height >= viewport.width;
    });

    public readonly isLandscape = computed(() => !this.isPortrait());

    public readonly preferredNavigationMode = computed(() => {
        switch (this.widthClass()) {
            case 'compact':
                return 'navigation-bar';

            case 'medium':
                return 'navigation-rail';

            case 'expanded':
            case 'large':
            case 'extra-large':
                return 'standard-drawer';
        }
    });

    public darkMode = signal<boolean>(true);

    constructor() {
        effect(() => {
            this.document.body.classList.toggle('md-scheme-dark', this.darkMode());
        });
    }

    public setDirection(direction: 'ltr' | 'rtl'): void {
        this.document.documentElement.dir = direction;
        this.direction.set(direction);
    }

    public registerMainPane(element: HTMLElement): void {
        this.mainPaneSub?.unsubscribe();

        const update = () => {
            const scrollTop = element.scrollTop;

            this.mainScrollTop.set(scrollTop);
        };

        update();

        this.mainPaneSub = new Subscription();

        element.addEventListener('scroll', update, { passive: true });

        this.mainPaneSub.add(() => {
            element.removeEventListener('scroll', update);
        });
    }

    public unregisterMainPane(element: HTMLElement): void {
        this.mainPaneSub?.unsubscribe();
        this.mainPaneSub = undefined;

        this.mainScrollTop.set(0);
    }
}
