import { Component, computed, contentChild, effect, ElementRef, inject, input, model, OnDestroy, Signal, signal, viewChild } from '@angular/core';
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
 *     <button md3-icon-button>...</button>
 *     <button md3-icon-button md3-toolbar-persistent>...</button>
 *     <button md3-fab>...</button>
 * </md3-toolbar>
 * ```
 *
 * A **floating** toolbar in a *bar* region leaves the layout flow, so the content passes
 * behind it. The scaffold pads the main pane by the height it covers. In a *rail* region it
 * stays in the flow and reserves its own space, so no padding is necessary.
 *
 * A **docked** toolbar fills its region. The specification allows it in a bar region only.
 *
 * Group actions with `md3-button-group`. The toolbar has one slots region, and it keeps the
 * authored order.
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
        '[class.md3-floating]': 'isFloating()',
        '[class.md3-docked]': '!isFloating()',
        '[class.md3-vibrant]': "toolbarColor() === 'vibrant'",
        '[class.md3-horizontal]': "effectiveOrientation() === 'horizontal'",
        '[class.md3-vertical]': "effectiveOrientation() === 'vertical'",
        '[class.md3-floating-region]': 'isFloatingRegion()',
        '[class.md3-bar-region]': 'isBarRegion()',
        '[class.md3-rail-region]': 'isRailRegion()',
        '[class.md3-hidden]': 'isHidden()',
        '[class.md3-collapsed]': 'isCollapsed()',
        '[class.md3-collapse-to-fab]': 'collapsesToFab()',
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
    private readonly fab = contentChild(FloatingActionButton);

    /** Set from the DOM, because `md3-toolbar-persistent` is a plain attribute, not a directive. */
    private readonly hasPersistentItem = signal<boolean>(false);
    private readonly hasFocusWithin = signal<boolean>(false);
    private persistentObserver?: MutationObserver;

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
    private readonly canCollapse = computed<boolean>(() => !!this.fab() || this.hasPersistentItem());

    /** With a FAB and no marked item, the container goes away and the FAB stays alone. */
    protected readonly collapsesToFab = computed<boolean>(() => !!this.fab() && !this.hasPersistentItem());

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

    // button context — the container is 4em high, so the buttons inside it are small.
    public buttonContextSize: Signal<ButtonSize> = signal<ButtonSize>('small');

    constructor() {
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

        const away = this.layout.mainScrollTop() > 0 && this.layout.isScrollingDown();

        this.isHidden.set(action === 'hide' && away);
        this.expanded.set(action === 'hide' ? true : !away);
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
