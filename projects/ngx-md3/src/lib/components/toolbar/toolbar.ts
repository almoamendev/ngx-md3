import { isPlatformBrowser } from '@angular/common';
import { Component, computed, contentChild, effect, ElementRef, inject, input, model, OnDestroy, PLATFORM_ID, Signal, signal, viewChild } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { LayoutService } from '../../foundations/layout.service';
import { ScaffoldBar } from '../../foundations/scaffold-bar';
import { ScaffoldRail } from '../../foundations/scaffold-rail';
import { ButtonSize } from '../../types/button-size.type';
import { ToolbarAlignment } from '../../types/toolbar-alignment.type';
import { ToolbarColor } from '../../types/toolbar-color.type';
import { ToolbarOrientation } from '../../types/toolbar-orientation.type';
import { ToolbarRegion } from '../../types/toolbar-region.type';
import { ToolbarScrollAction } from '../../types/toolbar-scroll-action.type';
import { ToolbarType } from '../../types/toolbar-type.type';
import { FloatingActionButton } from '../buttons/floating-action-button/floating-action-button';

/**
 * Material 3 toolbar.
 *
 * The toolbar holds the actions of the current page. Put it in a scaffold region, and the
 * region decides where it goes:
 *
 * ```html
 * <md3-toolbar md3-scaffold-bar="bottom" toolbar-type="floating" scroll-action="collapse">
 *     <md3-toolbar-item><button md3-icon-button>...</button></md3-toolbar-item>
 *     <md3-toolbar-item md3-toolbar-persistent><button md3-icon-button>...</button></md3-toolbar-item>
 *     <button md3-fab>...</button>
 * </md3-toolbar>
 * ```
 *
 * Every action goes inside an `md3-toolbar-item`. The toolbar projects that element only. A FAB is
 * the one exception: it sits beside the container, and a floating toolbar takes it.
 *
 * A **floating** toolbar in a *bar* region leaves the layout flow, so the content passes
 * behind it. The scaffold pads the main pane by the height it covers. In a *rail* region it
 * stays in the flow and reserves its own space, so no padding is necessary.
 *
 * A **docked** toolbar fills its region. The specification allows it in a bar region only.
 *
 * Group actions with `md3-button-group`. The toolbar has one slots region, and it keeps the
 * authored order. The space between the items follows the free space of the container, between
 * `--md-toolbar-gap-min` and `--md-toolbar-gap-max`.
 */
@Component({
    selector: 'md3-toolbar',
    templateUrl: './toolbar.html',
    styleUrl: './toolbar.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: Toolbar,
        },
    ],
    host: {
        'role': 'toolbar',
        '[attr.aria-orientation]': 'effectiveOrientation()',
        '[class.md3-floating-region]': 'isFloatingRegion()',
        '[class.md3-bar-region]': 'isBarRegion()',
        '[class.md3-rail-region]': 'isRailRegion()',
        '[class.md3-hidden]': 'isHidden()',
        '[class.md3-collapsed]': 'isCollapsed()',
        '[class.md3-collapse-to-fab]': 'isCollapsedToFab()',
        '(focusin)': 'onFocusIn()',
        '(focusout)': 'onFocusOut($event)',
    },
})
export class Toolbar implements ButtonContext, OnDestroy {
    private readonly el = inject(ElementRef);
    private readonly layout = inject(LayoutService);

    // The scaffold region directives sit on this same host element, so `self` is correct.
    private readonly scaffoldBar = inject(ScaffoldBar, { optional: true, self: true });
    private readonly scaffoldRail = inject(ScaffoldRail, { optional: true, self: true });

    public toolbarType = input<ToolbarType>('floating', {
        alias: 'toolbar-type',
    });

    public toolbarColor = input<ToolbarColor>('standard', {
        alias: 'toolbar-color',
    });

    /**
     * Leave this unset to follow the region. A rail region gives `vertical`, and every other
     * placement gives `horizontal`. Read `effectiveOrientation` for the resolved value.
     */
    public orientation = input<ToolbarOrientation | null>(null, {
        alias: 'orientation',
    });

    public alignment = input<ToolbarAlignment>('center', {
        alias: 'alignment',
    });

    public scrollAction = input<ToolbarScrollAction>('none', {
        alias: 'scroll-action',
    });

    public fabPosition = input<'start' | 'end'>('end', {
        alias: 'fab-position',
    });

    /** The collapse state. Scrolling writes to it, and you can read or set it yourself. */
    public expanded = model<boolean>(true);

    private readonly layoutElement = viewChild<ElementRef<HTMLElement>>('layout');
    private readonly containerElement = viewChild<ElementRef<HTMLElement>>('container');
    private readonly slotsElement = viewChild<ElementRef<HTMLElement>>('slots');
    private readonly fab = contentChild(FloatingActionButton);

    /** Set from the DOM, because `md3-toolbar-persistent` is a plain attribute, not a directive. */
    private readonly hasPersistentItem = signal<boolean>(false);
    private readonly hasFocusWithin = signal<boolean>(false);
    private persistentObserver?: MutationObserver;

    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    /** The last published free space, to keep an unchanged measurement from writing to the DOM. */
    private lastGap = -1;

    public readonly isFloating = computed<boolean>(() => this.toolbarType() === 'floating');

    public readonly effectiveOrientation = computed<ToolbarOrientation>(() => {
        return this.orientation() ?? (this.scaffoldRail ? 'vertical' : 'horizontal');
    });

    /** The logical side of the scaffold region, or null outside a scaffold. */
    public readonly region = computed<ToolbarRegion | null>(() => {
        if (this.scaffoldBar) {
            return this.scaffoldBar.region() === 'top' ? 'blockStart' : 'blockEnd';
        }

        if (this.scaffoldRail) {
            return this.scaffoldRail.region() === 'leading' ? 'inlineStart' : 'inlineEnd';
        }

        return null;
    });

    protected readonly isBarRegion = computed<boolean>(() => !!this.scaffoldBar);
    protected readonly isRailRegion = computed<boolean>(() => !!this.scaffoldRail);

    /** A floating toolbar inside a scaffold region needs the region to stop clipping it. */
    protected readonly isFloatingRegion = computed<boolean>(() => {
        return this.isFloating() && (this.isBarRegion() || this.isRailRegion());
    });

    /** Only a floating bar covers content it does not reserve. Everything else reserves its space. */
    private readonly coversContent = computed<boolean>(() => this.isFloating() && this.isBarRegion());

    /** Something must survive a collapse, or a collapse is just a hide. */
    private readonly canCollapse = computed<boolean>(() => (!!this.fab() && this.isFloating()) || this.hasPersistentItem());

    /** With a FAB and no marked item, a collapse takes the container away and the FAB stays alone. */
    protected readonly collapsesToFab = computed<boolean>(() => !!this.fab() && this.isFloating() && !this.hasPersistentItem());

    /** A vertical toolbar never reacts to scrolling, and a docked one never collapses. */
    public readonly resolvedScrollAction = computed<ToolbarScrollAction>(() => {
        const action = this.scrollAction();

        if (action === 'none' || this.effectiveOrientation() === 'vertical') {
            return 'none';
        }

        if (action === 'collapse' && (!this.isFloating() || !this.canCollapse())) {
            return 'hide';
        }

        return action;
    });

    public readonly isHidden = signal<boolean>(false);
    public readonly isCollapsed = computed<boolean>(() => {
        return this.resolvedScrollAction() === 'collapse' && !this.expanded();
    });

    /**
     * The collapsed state in which the FAB stays alone.
     *
     * This is the state, not the capability. A FAB by itself must never take the container
     * away, because a toolbar that does not collapse keeps its items at all times.
     */
    protected readonly isCollapsedToFab = computed<boolean>(() => this.isCollapsed() && this.collapsesToFab());

    // button context — the container is 4em high, so the buttons inside it are small.
    public buttonContextSize: Signal<ButtonSize> = signal<ButtonSize>('small');

    constructor() {
        effect(() => {
            if (this.isFloating()) {
                this.element.classList.add('md3-floating');
                this.element.classList.remove('md3-docked');
            } else {
                this.element.classList.add('md3-docked');
                this.element.classList.remove('md3-floating');
            }
        });

        effect((onCleanup) => {
            const orientation = 'md3-' + this.effectiveOrientation();
            this.element.classList.add(orientation);
            onCleanup(() => this.element.classList.remove(orientation));
        });

        effect((onCleanup) => {
            const color = 'md3-color-' + this.toolbarColor();
            this.element.classList.add(color);
            onCleanup(() => this.element.classList.remove(color));
        });

        effect((onCleanup) => {
            const alignment = 'md3-align-' + this.alignment();
            this.element.classList.add(alignment);
            onCleanup(() => this.element.classList.remove(alignment));
        });

        effect((onCleanup) => {
            const position = 'md3-fab-' + this.fabPosition();
            this.element.classList.add(position);
            onCleanup(() => this.element.classList.remove(position));
        });

        effect((onCleanup) => {
            const region = this.region();

            if (!region) {
                return;
            }

            const name = 'md3-region-' + region.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
            this.element.classList.add(name);
            onCleanup(() => this.element.classList.remove(name));
        });

        // Report what a floating bar covers, so the scaffold can pad the main pane and the
        // overlays can stay above it.
        effect((onCleanup) => {
            if (!this.coversContent()) {
                return;
            }

            const region = this.region();

            if (region !== 'blockStart' && region !== 'blockEnd') {
                return;
            }

            const element = this.layoutElement()?.nativeElement;

            if (!element) {
                return;
            }

            this.layout.registerFloatingBar(element, region);

            onCleanup(() => this.layout.unregisterFloatingBar(element));
        });

        effect(() => {
            this.updateScrollState();
        });

        effect(() => {
            const element = this.layoutElement()?.nativeElement;

            if (element) {
                this.watchPersistentItems(element);
            }
        });

        // Measure again when the region gives the toolbar a different amount of space, and when
        // the items themselves change size or number.
        effect((onCleanup) => {
            if (!this.isBrowser) {
                return;
            }

            // Read the state that changes the geometry, so a new orientation or a collapse
            // measures again without a resize.
            this.effectiveOrientation();
            this.isCollapsed();
            this.isCollapsedToFab();

            const layout = this.layoutElement()?.nativeElement;
            const slots = this.slotsElement()?.nativeElement;

            if (!layout || !slots) {
                return;
            }

            // The observer reports the first size as soon as it starts, so no separate initial
            // measurement is necessary.
            const observer = new ResizeObserver(() => this.measureGap());
            observer.observe(this.element);
            observer.observe(layout);
            observer.observe(slots);

            onCleanup(() => observer.disconnect());
        });

        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            effect(() => this.checkConfiguration());
        }
    }

    ngOnDestroy(): void {
        // The registration effect owns its own cleanup, so it unregisters the exact element
        // it measured.
        this.persistentObserver?.disconnect();
        this.persistentObserver = undefined;
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    protected onFocusIn(): void {
        this.hasFocusWithin.set(true);
    }

    protected onFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;

        if (next && this.element.contains(next)) {
            return;
        }

        this.hasFocusWithin.set(false);
    }

    private updateScrollState(): void {
        const action = this.resolvedScrollAction();

        if (action === 'none') {
            this.isHidden.set(false);
            this.expanded.set(true);
            return;
        }

        // Keep the toolbar reachable while it holds the focus. A keyboard or screen-reader
        // user must never lose the control they are on.
        if (this.hasFocusWithin()) {
            this.isHidden.set(false);
            this.expanded.set(true);
            return;
        }

        const away = this.layout.mainIsScrolled() && this.layout.isScrollingDown();

        this.isHidden.set(action === 'hide' && away);
        this.expanded.set(action === 'hide' ? true : !away);
    }

    /**
     * Divide the free space of the container between the gaps.
     *
     * The measurement starts from the host, because the host holds the space the region gives
     * the toolbar. A floating container is only as wide as its content, so reading the container
     * itself would feed the gap back into the measurement and the value would never settle.
     */
    private measureGap(): void {
        const layout = this.layoutElement()?.nativeElement;
        const container = this.containerElement()?.nativeElement;
        const slots = this.slotsElement()?.nativeElement;

        if (!layout || !container || !slots) {
            return;
        }

        const vertical = this.effectiveOrientation() === 'vertical';
        const items = Array.from(slots.children) as HTMLElement[];
        const extents = items.map((item) => this.extent(item, vertical));

        // A collapsed item keeps its box but loses its size, and it must not keep a gap either.
        const visible = extents.filter((extent) => extent > 0.5).length;

        if (visible < 2) {
            this.publishGap(0);
            return;
        }

        const content = extents.reduce((sum, extent) => sum + extent, 0);
        const free = this.contentExtent(this.element, vertical)
            - this.paddingExtent(layout, vertical)
            - this.siblingExtent(layout, container, vertical)
            - this.paddingExtent(container, vertical)
            - content;

        this.publishGap(free / (visible - 1));
    }

    private publishGap(gap: number): void {
        // Round down, so a fraction of a pixel never pushes the last item past the container.
        const value = Math.max(0, Math.floor(gap * 100) / 100);

        if (value === this.lastGap) {
            return;
        }

        this.lastGap = value;
        this.element.style.setProperty('--md-toolbar-gap-free', `${value}px`);
    }

    private extent(element: HTMLElement, vertical: boolean): number {
        const rect = element.getBoundingClientRect();

        return vertical ? rect.height : rect.width;
    }

    private contentExtent(element: HTMLElement, vertical: boolean): number {
        const size = vertical ? element.clientHeight : element.clientWidth;

        return Math.max(0, size - this.paddingExtent(element, vertical));
    }

    private paddingExtent(element: HTMLElement, vertical: boolean): number {
        const style = getComputedStyle(element);
        const start = parseFloat(vertical ? style.paddingTop : style.paddingLeft) || 0;
        const end = parseFloat(vertical ? style.paddingBottom : style.paddingRight) || 0;

        return start + end;
    }

    /** What the other children of the layout take, the flex gap that separates them included. */
    private siblingExtent(layout: HTMLElement, container: HTMLElement, vertical: boolean): number {
        const style = getComputedStyle(layout);
        const gap = parseFloat(vertical ? style.rowGap : style.columnGap) || 0;

        return (Array.from(layout.children) as HTMLElement[])
            .filter((child) => child !== container)
            .reduce((sum, child) => sum + this.extent(child, vertical) + gap, 0);
    }

    private watchPersistentItems(element: HTMLElement): void {
        this.persistentObserver?.disconnect();

        const update = () => {
            this.hasPersistentItem.set(!!element.querySelector('.md3-toolbar-slots [md3-toolbar-persistent]'));
        };

        update();

        if (typeof MutationObserver === 'undefined') {
            return;
        }

        this.persistentObserver = new MutationObserver(update);
        this.persistentObserver.observe(element, {
            childList: true,
            subtree: true,
            attributeFilter: ['md3-toolbar-persistent'],
        });
    }

    private checkConfiguration(): void {
        const explicit = this.orientation();
        const orientation = this.effectiveOrientation();

        if (this.isRailRegion() && !this.isFloating()) {
            this.warn('a docked toolbar needs the full window width, so it belongs in a scaffold bar region, not a rail.');
        }

        if (explicit === 'horizontal' && this.isRailRegion()) {
            this.warn('a horizontal toolbar does not fit a scaffold rail region. Move it to a bar region, or drop the orientation input.');
        }

        if (explicit === 'vertical' && this.isBarRegion()) {
            this.warn('a vertical toolbar does not fit a scaffold bar region. Move it to a rail region, or drop the orientation input.');
        }

        if (this.scrollAction() !== 'none' && orientation === 'vertical') {
            this.warn('a vertical toolbar ignores scroll-action.');
        }

        if (this.scrollAction() === 'collapse' && this.isFloating() && !this.canCollapse()) {
            this.warn('scroll-action="collapse" needs a FAB, or one item with the md3-toolbar-persistent attribute. The toolbar will hide instead.');
        }

        if (this.scrollAction() === 'collapse' && !this.isFloating()) {
            this.warn('a docked toolbar cannot collapse to a FAB. The toolbar will hide instead.');
        }
    }

    private warn(message: string): void {
        console.warn(`[md3-toolbar] ${message}`);
    }
}
