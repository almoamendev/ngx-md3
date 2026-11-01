import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, startWith } from 'rxjs';
import { ViewportWidth } from '../types/viewport-width.type';
import { ViewportHeight } from '../types/viewport-height.type';

export type Md3NavigationMode = 'none' | 'navigation-bar' | 'navigation-rail' | 'standard-drawer' | 'modal-drawer';

/**
 * The lower bound of each size class, in rem, largest first. A class runs up to the next one.
 *
 * These mirror the container queries in md-grid.scss — keep both in sync.
 */
const widthBreakpoints: ReadonlyArray<readonly [ViewportWidth, number]> = [
    ['extra-large', 100], // >=1600
    ['large', 75], // 1200-1599
    ['expanded', 52.5], // 840-1199
    ['medium', 37.5], // 600-839
    ['compact', 0] // < 600
];

const heightBreakpoints: ReadonlyArray<readonly [ViewportHeight, number]> = [
    ['expanded', 56.25], // >=900
    ['medium', 30], // 480-899
    ['compact', 0] // < 480
];

interface RootMetrics {
    /** The width of the root element, the box the `md-viewport` container query measures. */
    width: number;
    height: number;
    /** The computed font-size of the root element, in pixels: the size of one rem. */
    rem: number;
}

/**
 * The state of the window and of the document, for the whole application.
 *
 * This service is a singleton on purpose. A layout region can appear more than once — a page
 * scaffold, and a contained layout inside a full screen dialog — and each one keeps its own
 * scroll and inset state in its own {@link LayoutService}. The window size, the breakpoints,
 * the reading direction and the color scheme belong to the document, so they live here and
 * every layout reads the same values.
 *
 * The size classes are not media queries. A media query resolves rem against the browser's
 * default font-size and ignores `html { font-size }`, so the breakpoints could never scale with
 * the rest of the UI. Instead the service measures the root element and its font-size and
 * divides one by the other — the same calculation the `md-viewport` container query in
 * md-grid.scss makes, so a component and the grid always switch at the same pixel.
 */
@Injectable({
    providedIn: 'root'
})
export class ViewportService {
    private readonly document = inject(DOCUMENT);

    private readonly rootMetrics = signal<RootMetrics>(this.measureRoot());

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

    public readonly widthClass = computed<ViewportWidth>(() => {
        const { width, rem } = this.rootMetrics();
        return sizeClass(widthBreakpoints, width / rem);
    });

    public readonly heightClass = computed<ViewportHeight>(() => {
        const { height, rem } = this.rootMetrics();
        return sizeClass(heightBreakpoints, height / rem);
    });

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
            const darkMode = this.darkMode();
            this.document.body.classList.toggle('md-scheme-dark', darkMode);
            this.document.body.classList.toggle('md-scheme-light', !darkMode);
        });

        this.observeRoot();
    }

    public setDirection(direction: 'ltr' | 'rtl'): void {
        this.document.documentElement.dir = direction;
        this.direction.set(direction);
    }

    /**
     * Re-measure whenever the root element resizes or its font-size changes.
     *
     * Nothing reports a font-size change directly — it can come from a stylesheet, a class, an
     * inline style or the browser settings. So a hidden probe one rem wide is observed instead:
     * its width changes exactly when the rem does.
     */
    private observeRoot(): void {
        const view = this.document.defaultView;

        if (!view || !this.document.body || typeof ResizeObserver === 'undefined') {
            return;
        }

        const probe = this.document.createElement('div');
        probe.setAttribute('aria-hidden', 'true');
        probe.style.cssText = 'position: fixed; inset-block-start: 0; inset-inline-start: 0; inline-size: 1rem; block-size: 0; visibility: hidden; pointer-events: none;';
        this.document.body.appendChild(probe);

        const update = () => {
            const next = this.measureRoot();
            const current = this.rootMetrics();

            if (next.width !== current.width || next.height !== current.height || next.rem !== current.rem) {
                this.rootMetrics.set(next);
            }
        };

        const observer = new ResizeObserver(update);
        observer.observe(this.document.documentElement);
        observer.observe(probe);

        // The root keeps its width when only the window height changes, unless the app gives
        // it a height of its own.
        view.addEventListener('resize', update, { passive: true });

        inject(DestroyRef).onDestroy(() => {
            observer.disconnect();
            view.removeEventListener('resize', update);
            probe.remove();
        });
    }

    private measureRoot(): RootMetrics {
        const root = this.document.documentElement;
        const view = this.document.defaultView;
        const rem = Number.parseFloat(view?.getComputedStyle(root).fontSize ?? '') || 16;

        return {
            width: root.clientWidth,
            height: view?.innerHeight ?? root.clientHeight,
            rem
        };
    }
}

function sizeClass<T extends string>(breakpoints: ReadonlyArray<readonly [T, number]>, size: number): T {
    const match = breakpoints.find(([, min]) => size >= min);
    return (match ?? breakpoints[breakpoints.length - 1])[0];
}
