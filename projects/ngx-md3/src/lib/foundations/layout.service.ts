import { effect, inject, Injectable, signal, computed, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Md3NavigationMode, ViewportService } from './viewport.service';

export type FloatingBarSide = 'blockStart' | 'blockEnd';

export interface FloatingInset {
    blockStart: number;
    blockEnd: number;
}

export type { Md3NavigationMode };

/**
 * The state of one layout container: what its main pane scrolls, and what its floating bars
 * cover.
 *
 * The service is provided at the root, and the page scaffold uses that root instance. A
 * contained layout — `md3-layout`, the one a full screen dialog holds — provides its own
 * instance instead, so a toolbar inside it reads the scroll and the insets of that layout and
 * never of the page behind it.
 *
 * The window size, the breakpoints, the reading direction and the color scheme belong to the
 * document, not to a container. They live in {@link ViewportService}, and every instance of
 * this service exposes the same signals, so an instance stays a complete view of the layout.
 */
@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private readonly viewportService = inject(ViewportService);
    // Optional — LayoutService (and anything built on Scaffold) shouldn't
    // hard-require the Router, only benefit from it when it's present.
    private readonly router = inject(Router, { optional: true });

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
     * Distance, in pixels, between the bottom of the container and the bottom edge of
     * the .md3-panes-container — i.e. whatever the bottom bar currently reserves, or 0 when
     * there is none. Overlay-based components anchored to the bottom (like Snackbar) read
     * this so they never render lower than the panes container.
     */
    readonly bottomInset = signal<number>(0);

    /**
     * Space a floating bar covers but does not reserve, per logical block side.
     *
     * A floating toolbar in a bar region leaves the layout flow, so its grid track collapses
     * and the content flows under it. This signal reports what it covers, so the layout can
     * pad the main pane and overlays can stay clear of it.
     *
     * A floating toolbar in a *rail* region stays in the flow and reserves its own space, so
     * it never appears here.
     */
    readonly floatingInset = signal<FloatingInset>({ blockStart: 0, blockEnd: 0 });

    /**
     * The distance from the bottom that an anchored overlay must keep clear. It covers both
     * the reserved bottom bar and any floating bottom bar over it.
     */
    readonly bottomSafeInset = computed<number>(() => this.bottomInset() + this.floatingInset().blockEnd);

    // The state of the window and of the document. It is shared by every layout, so these are
    // the same signals on every instance of this service.
    public readonly viewport = this.viewportService.viewport;
    public readonly widthClass = this.viewportService.widthClass;
    public readonly heightClass = this.viewportService.heightClass;
    public readonly direction = this.viewportService.direction;
    public readonly isCompact = this.viewportService.isCompact;
    public readonly isMedium = this.viewportService.isMedium;
    public readonly isExpanded = this.viewportService.isExpanded;
    public readonly isLarge = this.viewportService.isLarge;
    public readonly isExtraLarge = this.viewportService.isExtraLarge;
    public readonly isPortrait = this.viewportService.isPortrait;
    public readonly isLandscape = this.viewportService.isLandscape;
    public readonly preferredNavigationMode = this.viewportService.preferredNavigationMode;
    public darkMode = this.viewportService.darkMode;

    constructor() {
        // Keep the scroll direction in step with the position. Anything that writes
        // mainScrollTop drives it, so the app bar and the toolbar always agree.
        effect(() => {
            this.updateScrollDirection(this.mainScrollTop());
        });

        // Reset the main pane to the top after every completed navigation — otherwise a
        // scrolled-down list page leaves the next page's content scrolled down too, since the
        // pane itself never remounts on route change.
        this.router?.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(),
            )
            .subscribe(() => this.scrollMainPaneToTop());
    }

    public setDirection(direction: 'ltr' | 'rtl'): void {
        this.viewportService.setDirection(direction);
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
            const bottom = element.ownerDocument.defaultView?.innerHeight ?? 0;
            this.bottomInset.set(Math.max(0, Math.round(bottom - rect.bottom)));
        };

        update();

        this.panesContainerResizeObserver = new ResizeObserver(update);
        this.panesContainerResizeObserver.observe(element);

        this.panesContainerResizeListener = update;
        window.addEventListener('resize', update, { passive: true });
    }

    /**
     * Register a floating bar so the layout and the overlays know what it covers.
     *
     * Call this for a floating toolbar in a *bar* region only. A rail region keeps the toolbar
     * in the layout flow, so it reserves its space and needs no inset.
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

        // Read the current value untracked. A component registers its floating bar from an
        // effect, so a tracked read would make that effect depend on the signal that the same
        // run writes. The cleanup measures an empty map and writes 0, the body measures the bar
        // and writes its size, and the effect dirties itself again on every run. That loop never
        // settles, and change detection never finishes.
        const current = untracked(this.floatingInset);

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
