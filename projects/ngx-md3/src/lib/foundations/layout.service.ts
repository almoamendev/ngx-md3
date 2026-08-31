import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, fromEvent, map, startWith, Subscription } from 'rxjs';
import { ViewportWidth } from '../types/viewport-width.type';
import { ViewportHeight } from '../types/viewport-height.type';

export type FloatingBarSide = 'blockStart' | 'blockEnd';

export interface FloatingInset {
    blockStart: number;
    blockEnd: number;
}

export type Md3NavigationMode = 'none' | 'navigation-bar' | 'navigation-rail' | 'standard-drawer' | 'modal-drawer';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private readonly document = inject(DOCUMENT);
    private readonly breakpointObserver = inject(BreakpointObserver);
    // Optional — LayoutService (and anything built on Scaffold) shouldn't
    // hard-require the Router, only benefit from it when it's present.
    private readonly router = inject(Router, { optional: true });

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
    private mainPaneEl?: HTMLElement;
    private panesContainerResizeObserver?: ResizeObserver;
    private panesContainerResizeListener?: () => void;

    /** Floating bars currently registered, keyed by the measured element. */
    private readonly floatingBars = new Map<HTMLElement, { side: FloatingBarSide; observer: ResizeObserver; }>();

    /** How far the main pane must move before the scroll direction flips. Stops jitter. */
    private static readonly scrollDirectionThreshold = 64;
    private scrollPosition = 0;

    readonly mainScrollTop = signal<number>(0);
    readonly mainIsScrolled = computed<boolean>(() => this.mainScrollTop() > 0);

    /**
     * True while the main pane moves down, false while it moves up. A small threshold keeps
     * a jitter from flipping the value. Components that react to scrolling — the app bar and
     * the toolbar — read this, so they can never disagree.
     */
    readonly isScrollingDown = signal<boolean>(false);

    /**
     * Distance, in pixels, between the viewport bottom and the bottom edge of
     * the scaffold's .md3-panes-container — i.e. whatever the bottom scaffold
     * bar (nav bar) currently reserves, or 0 when there is none. Overlay-based
     * components anchored to the viewport bottom (like Snackbar) read this so
     * they never render lower than the panes container.
     */
    readonly bottomInset = signal<number>(0);

    /**
     * Space a floating scaffold bar covers but does not reserve, per logical block side.
     *
     * A floating toolbar in a bar region leaves the layout flow, so its grid track collapses
     * and the content flows under it. This signal reports what it covers, so the scaffold can
     * pad the main pane and overlays can stay clear of it.
     *
     * A floating toolbar in a *rail* region stays in the flow and reserves its own space, so
     * it never appears here.
     */
    readonly floatingInset = signal<FloatingInset>({ blockStart: 0, blockEnd: 0 });

    /**
     * The distance from the viewport bottom that a viewport-anchored overlay must keep clear.
     * It covers both the reserved bottom bar and any floating bottom bar over it.
     */
    readonly bottomSafeInset = computed<number>(() => this.bottomInset() + this.floatingInset().blockEnd);

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
        // Keep the scroll direction in step with the position. Anything that writes
        // mainScrollTop drives it, so the app bar and the toolbar always agree.
        effect(() => {
            this.updateScrollDirection(this.mainScrollTop());
        });

        effect(() => {
            const darkMode = this.darkMode();
            this.document.body.classList.toggle('md-scheme-dark', darkMode);
            this.document.body.classList.toggle('md-scheme-light', !darkMode);
        });

        // Reset the scaffold's main pane to the top after every completed
        // navigation — otherwise a scrolled-down list page leaves the next
        // page's content scrolled down too, since the pane itself never
        // remounts on route change.
        this.router?.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(),
            )
            .subscribe(() => this.scrollMainPaneToTop());
    }

    public setDirection(direction: 'ltr' | 'rtl'): void {
        this.document.documentElement.dir = direction;
        this.direction.set(direction);
    }

    private scrollMainPaneToTop(): void {
        this.mainPaneEl?.scrollTo({ top: 0 });
        this.mainScrollTop.set(0);
        this.resetScrollDirection();
    }

    public registerMainPane(element: HTMLElement): void {
        this.mainPaneSub?.unsubscribe();
        this.mainPaneEl = element;

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

        if (this.mainPaneEl === element) {
            this.mainPaneEl = undefined;
        }

        this.mainScrollTop.set(0);
        this.resetScrollDirection();
    }

    private resetScrollDirection(): void {
        this.scrollPosition = 0;
        this.isScrollingDown.set(false);
    }

    private updateScrollDirection(scrollTop: number): void {
        if (scrollTop === this.scrollPosition) {
            return;
        }

        const offset = scrollTop - this.scrollPosition;

        if (Math.abs(offset) <= LayoutService.scrollDirectionThreshold) {
            return;
        }

        this.isScrollingDown.set(offset > 0);
        this.scrollPosition = scrollTop;
    }

    public registerPanesContainer(element: HTMLElement): void {
        this.unregisterPanesContainer();

        const update = () => {
            const rect = element.getBoundingClientRect();
            this.bottomInset.set(Math.max(0, Math.round(window.innerHeight - rect.bottom)));
        };

        update();

        this.panesContainerResizeObserver = new ResizeObserver(update);
        this.panesContainerResizeObserver.observe(element);

        this.panesContainerResizeListener = update;
        window.addEventListener('resize', update, { passive: true });
    }

    /**
     * Register a floating bar so the scaffold and the overlays know what it covers.
     *
     * Call this for a floating toolbar in a scaffold *bar* region only. A rail region keeps
     * the toolbar in the layout flow, so it reserves its own space and needs no inset.
     */
    public registerFloatingBar(element: HTMLElement, side: FloatingBarSide): void {
        this.unregisterFloatingBar(element);

        const observer = new ResizeObserver(() => this.measureFloatingBars());
        observer.observe(element);

        this.floatingBars.set(element, { side, observer });
        this.measureFloatingBars();
    }

    public unregisterFloatingBar(element: HTMLElement): void {
        const entry = this.floatingBars.get(element);

        if (!entry) {
            return;
        }

        entry.observer.disconnect();
        this.floatingBars.delete(element);
        this.measureFloatingBars();
    }

    private measureFloatingBars(): void {
        let blockStart = 0;
        let blockEnd = 0;

        for (const [element, entry] of this.floatingBars) {
            const size = this.measureBlockSize(element);

            if (entry.side === 'blockStart') {
                blockStart = Math.max(blockStart, size);
            } else {
                blockEnd = Math.max(blockEnd, size);
            }
        }

        const current = this.floatingInset();

        // Only write on a real change. The main pane padding reads this value, and padding
        // changes the panes container size, which fires the observer again.
        if (current.blockStart === blockStart && current.blockEnd === blockEnd) {
            return;
        }

        this.floatingInset.set({ blockStart, blockEnd });
    }

    /**
     * `offsetHeight` ignores transforms. So a toolbar that scrolling has hidden or collapsed
     * still reports its expanded size, and the content padding never moves while the user
     * scrolls.
     */
    private measureBlockSize(element: HTMLElement): number {
        if (typeof getComputedStyle === 'undefined') {
            return element.offsetHeight || 0;
        }

        const styles = getComputedStyle(element);
        const start = Number.parseFloat(styles.marginBlockStart) || 0;
        const end = Number.parseFloat(styles.marginBlockEnd) || 0;

        return Math.max(0, Math.round(element.offsetHeight + start + end));
    }

    public unregisterPanesContainer(): void {
        this.panesContainerResizeObserver?.disconnect();
        this.panesContainerResizeObserver = undefined;

        if (this.panesContainerResizeListener) {
            window.removeEventListener('resize', this.panesContainerResizeListener);
            this.panesContainerResizeListener = undefined;
        }

        this.bottomInset.set(0);
    }
}
