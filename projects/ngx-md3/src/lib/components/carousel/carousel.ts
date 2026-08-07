import { Directionality } from '@angular/cdk/bidi';
import { isPlatformBrowser } from '@angular/common';
import {
    afterNextRender,
    Component,
    computed,
    contentChildren,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    model,
    numberAttribute,
    PLATFORM_ID,
    signal,
    viewChild,
} from '@angular/core';
import { CarouselArrangement } from '../../interfaces/carousel-arrangement.interface';
import { CarouselGeometry } from '../../interfaces/carousel-keyline.interface';
import { CarouselAlignment } from '../../types/carousel-alignment.type';
import { CarouselLayout } from '../../types/carousel-layout.type';
import { CarouselOrientation } from '../../types/carousel-orientation.type';
import { CAROUSEL_STRATEGIES } from './carousel-arrangement';
import {
    buildGeometry,
    clampIndex,
    indexForScrollOffset,
    resolveItemGeometry,
    resolveState,
    scrollOffsetForIndex,
} from './carousel-keylines';
import { CarouselItem } from './carousel-item/carousel-item';

/**
 * Reads an aspect ratio from an input value.
 *
 * Accepts a number (`1.778`) or the more readable fraction form (`"16 / 9"`). Anything that is
 * not a positive, finite ratio resolves to `undefined`, which leaves the height to CSS.
 */
export function parseCarouselAspectRatio(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }

    let ratio: number;

    if (typeof value === 'number') {
        ratio = value;
    } else {
        const parts = String(value).split('/');
        ratio = parts.length === 2
            ? Number(parts[0]) / Number(parts[1])
            : Number(parts[0]);
    }

    return Number.isFinite(ratio) && ratio > 0 ? ratio : undefined;
}

/** Grace period after a programmatic scroll before the index is synced back from the DOM. */
const SCROLL_END_FALLBACK = 120;

/**
 * A Material Design 3 carousel.
 *
 * Items are laid out against a set of keylines — large, medium, small and an off-screen anchor —
 * and adopt the size of whichever keyline they are passing through, so they grow into the focal
 * range and crop away as they leave it.
 *
 * Scrolling is native, which keeps momentum, touch, snapping and the scrollbar intact. Only the
 * visual sizing is derived in TypeScript, and it is written straight to CSS custom properties so
 * scrolling never triggers change detection.
 *
 * All size inputs are in pixels.
 *
 * ```html
 * <md3-carousel [(index)]="selected" [item-size]="200">
 *   @for (photo of photos(); track photo.id) {
 *     <md3-carousel-item>
 *       <img [src]="photo.url" [alt]="photo.alt" />
 *     </md3-carousel-item>
 *   }
 * </md3-carousel>
 * ```
 */
@Component({
    selector: 'md3-carousel',
    templateUrl: './carousel.html',
    styleUrl: './carousel.scss',
    host: {
        'role': 'group',
        'aria-roledescription': 'carousel',
    },
})
export class Carousel {
    /** Arrangement strategy. Additional Material Design layouts will widen this type. */
    public carouselLayout = input<CarouselLayout>('multi-browse', {
        alias: 'carousel-layout',
    });

    /** Where the focal (large) items sit within the container. */
    public alignment = input<CarouselAlignment>('start', {
        alias: 'alignment',
    });

    /** Scroll axis. Only `horizontal` is implemented today. */
    public orientation = input<CarouselOrientation>('horizontal', {
        alias: 'orientation',
    });

    /** Preferred size of a fully unmasked item, in pixels. */
    public itemSize = input<number, unknown>(200, {
        alias: 'item-size',
        transform: numberAttribute,
    });

    /** Smallest a small item may shrink to, in pixels. */
    public smallItemSizeMin = input<number, unknown>(40, {
        alias: 'small-item-size-min',
        transform: numberAttribute,
    });

    /** Largest a small item may grow to, in pixels. */
    public smallItemSizeMax = input<number, unknown>(56, {
        alias: 'small-item-size-max',
        transform: numberAttribute,
    });

    /** Space between items, in pixels. */
    public gap = input<number, unknown>(8, {
        alias: 'gap',
        transform: numberAttribute,
    });

    /**
     * Width-to-height ratio of a fully unmasked item, as a number or a `"16 / 9"` fraction.
     *
     * The solver changes item width as the container resizes, so a fixed height would let the
     * ratio drift. Setting this derives the carousel's height from the solved item width
     * instead, keeping items at a constant shape at every viewport size.
     *
     * Leave it unset to size the carousel with `--md3-carousel-height` in CSS.
     */
    public aspectRatio = input<number | undefined, unknown>(undefined, {
        alias: 'aspect-ratio',
        transform: parseCarouselAspectRatio,
    });

    /**
     * Index of the item leading the focal range. Two-way bindable.
     *
     * Clamped to {@link lastIndex}: the final items share the focal range and are all visible at
     * once, so there is no scroll position where any of them leads on its own. Setting a higher
     * value scrolls to the end and reads back as `lastIndex`.
     */
    public index = model<number>(0);

    /** Items projected into the carousel, in document order. */
    public readonly items = contentChildren<CarouselItem>(CarouselItem, { descendants: true });

    /**
     * Whether the current layout brings items to rest on keylines.
     *
     * Decided by the layout, not by the consumer: an arrangement that resizes items only reads
     * correctly when they are sitting on keylines.
     */
    public readonly snap = computed<boolean>(() => CAROUSEL_STRATEGIES[this.carouselLayout()].snap);

    private scroller = viewChild.required<ElementRef<HTMLDivElement>>('scroller');

    private containerSize = signal<number>(0);

    private readonly directionality = inject(Directionality, { optional: true });

    /**
     * Sizes handed to the solver.
     *
     * Gaps are folded into item sizes so the solver only has one quantity to balance, then
     * removed again visually by insetting each item half a gap on both sides.
     */
    private readonly metrics = computed(() => {
        const gap = this.gap();

        return {
            gap,
            itemSize: this.itemSize() + gap,
            smallSizeMin: this.smallItemSizeMin() + gap,
            smallSizeMax: this.smallItemSizeMax() + gap,
        };
    });

    /** The solved distribution of large, medium and small items for the current container. */
    public readonly arrangement = computed<CarouselArrangement | undefined>(() => {
        const containerSize = this.containerSize();
        const itemCount = this.items().length;
        const { itemSize, smallSizeMin, smallSizeMax } = this.metrics();

        if (containerSize <= 0 || itemCount === 0 || itemSize <= 0) {
            return undefined;
        }

        return CAROUSEL_STRATEGIES[this.carouselLayout()].arrange({
            containerSize,
            itemSize,
            smallSizeMin,
            smallSizeMax,
            itemCount,
            alignment: this.alignment(),
        });
    });

    /** Keyline geometry derived from the arrangement. */
    public readonly geometry = computed<CarouselGeometry | undefined>(() => {
        const arrangement = this.arrangement();

        if (!arrangement) {
            return undefined;
        }

        return buildGeometry(arrangement, this.alignment(), this.items().length, this.containerSize());
    });

    /** Scroll offsets that items snap to, one per item. */
    protected readonly snapPoints = computed<number[]>(() => {
        const geometry = this.geometry();

        if (!geometry) {
            return [];
        }

        return this.items().map((_, index) => scrollOffsetForIndex(geometry, index));
    });

    /**
     * Highest index the carousel can rest on.
     *
     * Lower than the last item's index, because the trailing items share the focal range once
     * the carousel is scrolled to the end. It moves as the container is resized, since a wider
     * container fits more items in the focal range.
     */
    public readonly lastIndex = computed<number>(() => this.geometry()?.lastIndex ?? 0);

    /**
     * Height implied by `aspect-ratio`, in pixels, or `undefined` when CSS owns the height.
     *
     * Measured against a focal item's visible width — the solved item size less the gap — so a
     * fully unmasked item matches the requested ratio exactly. Masked items keep this height and
     * crop horizontally, which is what the Material Design arrangement expects.
     */
    public readonly resolvedHeight = computed<number | undefined>(() => {
        const ratio = this.aspectRatio();
        const geometry = this.geometry();

        if (!ratio || !geometry) {
            return undefined;
        }

        return (geometry.itemSize - this.metrics().gap) / ratio;
    });

    public readonly atStart = computed<boolean>(() => this.index() <= 0);

    /** True when the carousel cannot scroll any further towards the end. */
    public readonly atEnd = computed<boolean>(() => this.index() >= this.lastIndex());

    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    private scrollEndTimer: ReturnType<typeof setTimeout> | undefined;
    private frame = 0;

    /**
     * Target of an in-flight programmatic scroll.
     *
     * Smooth scrolling reports intermediate offsets, and reading the index back from those would
     * fight the animation, so index syncing pauses until the target is reached or the user takes
     * over.
     */
    private pendingScroll: number | undefined;

    constructor(private el: ElementRef<HTMLElement>) {
        // ResizeObserver alone would leave the carousel unmeasured until its first callback, so
        // take an initial measurement as soon as the view exists.
        afterNextRender(() => this.measure());

        effect((onCleanup) => {
            if (!this.isBrowser) {
                return;
            }

            const observer = new ResizeObserver(() => this.measure());
            observer.observe(this.element);

            onCleanup(() => observer.disconnect());
        });

        effect((onCleanup) => {
            if (!this.isBrowser) {
                return;
            }

            const scroller = this.scroller().nativeElement;

            const onScroll = () => this.scheduleGeometry();
            const onScrollEnd = () => this.syncIndexFromScroll();
            const onInteract = () => {
                this.pendingScroll = undefined;
            };

            scroller.addEventListener('scroll', onScroll, { passive: true });
            scroller.addEventListener('scrollend', onScrollEnd);
            scroller.addEventListener('pointerdown', onInteract, { passive: true });
            scroller.addEventListener('wheel', onInteract, { passive: true });
            scroller.addEventListener('touchstart', onInteract, { passive: true });

            onCleanup(() => {
                clearTimeout(this.scrollEndTimer);
                cancelAnimationFrame(this.frame);
                scroller.removeEventListener('scroll', onScroll);
                scroller.removeEventListener('scrollend', onScrollEnd);
                scroller.removeEventListener('pointerdown', onInteract);
                scroller.removeEventListener('wheel', onInteract);
                scroller.removeEventListener('touchstart', onInteract);
            });
        });

        // Re-place every item whenever the arrangement or the item list changes. Reading the
        // signals here is what registers the dependency.
        effect(() => {
            this.geometry();
            this.items();
            this.applyGeometry();
        });

        // Derive the height from the solved item width so items keep their shape as the
        // container resizes. Changing the height cannot feed back into the arrangement, which
        // only depends on the container's width, so this settles in one pass.
        effect(() => {
            const height = this.resolvedHeight();

            if (height === undefined) {
                this.element.style.removeProperty('--md3-carousel-aspect-height');
                return;
            }

            this.element.style.setProperty('--md3-carousel-aspect-height', `${height}px`);
        });

        // Follow the index when it is set from outside, but not while the user is scrolling —
        // `syncIndexFromScroll` only writes a value the DOM already agrees with.
        effect(() => {
            const index = this.index();
            const geometry = this.geometry();

            if (!geometry || !this.isBrowser) {
                return;
            }

            // A resize changes how many items share the focal range, so an index that was
            // reachable before may no longer be.
            const clamped = clampIndex(geometry, index);

            if (clamped !== index) {
                this.index.set(clamped);
                return;
            }

            const target = scrollOffsetForIndex(geometry, clamped);

            if (Math.abs(this.scrollOffset() - target) > 1) {
                this.scrollTo(target, 'smooth');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    /** True when laid out right-to-left. */
    protected get isRtl(): boolean {
        return this.directionality?.value === 'rtl'
            || getComputedStyle(this.element).direction === 'rtl';
    }

    @HostListener('keydown', ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        // Arrow keys are direction-agnostic here: ArrowRight always moves towards the visual
        // right, which under RTL is the previous item.
        const forward = this.isRtl ? 'ArrowLeft' : 'ArrowRight';
        const backward = this.isRtl ? 'ArrowRight' : 'ArrowLeft';

        switch (event.key) {
            case forward:
                this.next();
                break;
            case backward:
                this.previous();
                break;
            case 'Home':
                this.scrollToIndex(0);
                break;
            case 'End':
                this.scrollToIndex(this.lastIndex());
                break;
            default:
                return;
        }

        event.preventDefault();
    }

    /**
     * Keeps a focused item in view.
     *
     * Items are absolutely positioned, so the browser cannot scroll them into view on its own.
     * Without this, tabbing to a link inside a cropped item would leave it invisible.
     */
    @HostListener('focusin', ['$event'])
    protected onFocusIn(event: FocusEvent): void {
        const target = event.target;

        if (!(target instanceof Node)) {
            return;
        }

        const index = this.items().findIndex((item) => item.element.contains(target));

        if (index >= 0 && index !== this.index()) {
            this.scrollToIndex(index);
        }
    }

    /** Scrolls until `index` leads the focal range, clamping to {@link lastIndex}. */
    public scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
        const geometry = this.geometry();

        if (!geometry) {
            return;
        }

        const clamped = clampIndex(geometry, index);

        this.index.set(clamped);
        this.scrollTo(scrollOffsetForIndex(geometry, clamped), behavior);
    }

    public next(): void {
        this.scrollToIndex(this.index() + 1);
    }

    public previous(): void {
        this.scrollToIndex(this.index() - 1);
    }

    private measure(): void {
        if (!this.isBrowser) {
            return;
        }

        this.containerSize.set(this.scroller().nativeElement.clientWidth);
    }

    /**
     * Current scroll position as a positive offset from the logical start edge.
     *
     * Right-to-left scroll containers report `scrollLeft` as zero at the start and negative
     * moving away from it, so the magnitude is the logical offset in both directions.
     */
    private scrollOffset(): number {
        return Math.abs(this.scroller().nativeElement.scrollLeft);
    }

    private scrollTo(offset: number, behavior: ScrollBehavior): void {
        if (!this.isBrowser) {
            return;
        }

        const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.pendingScroll = offset;
        this.scroller().nativeElement.scrollTo({
            left: this.isRtl ? -offset : offset,
            behavior: reduceMotion ? 'auto' : behavior,
        });

        this.scheduleIndexSync();
    }

    private scheduleGeometry(): void {
        if (this.frame) {
            return;
        }

        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.applyGeometry();
        });

        this.scheduleIndexSync();
    }

    /** `scrollend` is not universally supported, so back it with a timer. */
    private scheduleIndexSync(): void {
        clearTimeout(this.scrollEndTimer);
        this.scrollEndTimer = setTimeout(() => this.syncIndexFromScroll(), SCROLL_END_FALLBACK);
    }

    private syncIndexFromScroll(): void {
        const geometry = this.geometry();

        if (!geometry || !this.isBrowser) {
            return;
        }

        const offset = this.scrollOffset();

        // Wait for a programmatic scroll to land rather than reading the index off an
        // intermediate frame of the animation.
        if (this.pendingScroll !== undefined) {
            if (Math.abs(offset - this.pendingScroll) > 1) {
                return;
            }

            this.pendingScroll = undefined;
        }

        // Once the final items share the focal range they also share a scroll offset, so an
        // index that already resolves to this offset is left alone.
        if (Math.abs(scrollOffsetForIndex(geometry, this.index()) - offset) <= 1) {
            return;
        }

        const index = indexForScrollOffset(geometry, offset);

        if (index !== this.index()) {
            this.index.set(index);
        }
    }

    /**
     * Writes the current placement of every item.
     *
     * Runs on every scroll frame, so it touches the DOM directly and allocates nothing beyond
     * the resolved state.
     */
    private applyGeometry(): void {
        const geometry = this.geometry();
        const items = this.items();

        if (!geometry) {
            return;
        }

        const style = this.element.style;
        style.setProperty('--md3-carousel-scroll-size', `${geometry.scrollSize}px`);
        style.setProperty('--md3-carousel-viewport-size', `${this.containerSize()}px`);
        style.setProperty('--md3-carousel-gap', `${this.metrics().gap}px`);

        const scrollOffset = this.scrollOffset();
        const state = resolveState(geometry, scrollOffset);
        const itemCount = items.length;

        items.forEach((item, index) => {
            item.applyGeometry(
                resolveItemGeometry(geometry, state, index, scrollOffset),
                geometry.itemSize,
            );

            const label = `${index + 1} of ${itemCount}`;

            if (item.element.getAttribute('aria-label') !== label) {
                item.element.setAttribute('aria-label', label);
            }
        });
    }
}
