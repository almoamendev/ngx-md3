import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import {
    Component,
    ComponentRef,
    effect,
    ElementRef,
    inject,
    Injector,
    isDevMode,
    OnDestroy,
    signal,
    Signal,
    Type,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BOTTOM_SHEET_CONFIG } from './bottom-sheet-ref';
import { BottomSheetSurface } from './bottom-sheet-surface';
import {
    BottomSheetConfig,
    BottomSheetState,
    StandardBottomSheetHost,
} from '../../../interfaces/bottom-sheet-config.interface';

let nextRegionId = 0;

/**
 * Standard bottom sheet shell: page furniture rather than a dialog. It docks into the
 * scaffold's sheet region and floats over the content from there, above the bottom bar and
 * without a scrim, leaving the page scrolling, clickable and focusable behind it. Nothing here
 * traps focus or handles Escape, which is the whole difference from the modal shell — the
 * surface, the handle and the gesture are shared.
 */
@Component({
    selector: 'md3-standard-bottom-sheet',
    imports: [
        CdkPortalOutlet,
        BottomSheetSurface,
    ],
    templateUrl: './standard-bottom-sheet.html',
    styleUrl: './standard-bottom-sheet.scss',
    host: {
        'role': 'region',
        '[attr.id]': 'regionId',
        '[attr.aria-label]': 'label() || null',
        '[attr.aria-labelledby]': 'labelledBy() || null',
    },
})
export class StandardBottomSheet implements StandardBottomSheetHost, OnDestroy {
    @ViewChild(CdkPortalOutlet, { static: true })
    private readonly portalOutlet!: CdkPortalOutlet;

    @ViewChild(BottomSheetSurface, { static: true })
    private readonly surface!: BottomSheetSurface;

    protected readonly config = inject<BottomSheetConfig>(BOTTOM_SHEET_CONFIG, { optional: true }) ?? {};
    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    /** Named so the drag handle can point `aria-controls` at the region it expands. */
    public readonly regionId = `md3-bottom-sheet-${nextRegionId++}`;

    public readonly showHandle = signal<boolean>(this.config.handle ?? true);
    public readonly allowGestures = signal<boolean>(this.config.gestures ?? true);
    public readonly dismissible = signal<boolean>(this.config.dismissible ?? false);
    public readonly initialState = signal<BottomSheetState>(this.config.initialState ?? 'collapsed');
    public readonly label = signal<string>(this.config.label ?? '');
    public readonly labelledBy = signal<string>(this.config.labelledBy ?? '');
    public readonly collapsedHeight = signal<string>(toCssLength(this.config.collapsedHeight, '10em'));
    public readonly expandedHeight = signal<string>(toCssLength(this.config.expandedHeight, '70dvh'));

    /**
     * Whatever had focus when the sheet opened, so it can be handed back — but only if the
     * sheet still holds focus when it closes, rather than yanking it off whatever the user
     * moved on to in the meantime.
     */
    private readonly previouslyFocused = document.activeElement as HTMLElement | null;

    constructor() {
        effect(() => {
            const element = this.el.nativeElement;

            element.style.setProperty('--md3-bottom-sheet-collapsed-height', this.collapsedHeight());
            element.style.setProperty('--md3-bottom-sheet-expanded-height', this.expandedHeight());
        });

        if (isDevMode() && !this.config.label && !this.config.labelledBy) {
            console.warn(
                'A standard bottom sheet without a `label` or `labelledBy` is not exposed as a '
                + 'landmark to assistive technology. Pass one in the sheet configuration.',
            );
        }
    }

    public get state(): Signal<BottomSheetState> {
        return this.surface.state;
    }

    public get surfaceElement(): HTMLElement | null {
        return this.surface.surfaceElement;
    }

    public get dismissed(): Observable<void> {
        return this.surface.dismissed;
    }

    public get dragProgress(): Observable<number> {
        return this.surface.dragProgress;
    }

    public get stateChanges(): Observable<BottomSheetState> {
        return this.surface.stateChanges;
    }

    public startEnterAnimation(): void {
        this.surface.startEnterAnimation();
    }

    public setActive(value: boolean): void {
        this.surface.setActive(value);
    }

    public expand(): void {
        this.surface.expand();
    }

    public collapse(): void {
        this.surface.collapse();
    }

    public toggle(): void {
        this.surface.toggle();
    }

    public setCollapsedHeight(value: number | string): void {
        this.collapsedHeight.set(toCssLength(value, '10em'));
        this.surface.remeasure();
    }

    public setExpandedHeight(value: number | string): void {
        this.expandedHeight.set(toCssLength(value, '70dvh'));
        this.surface.remeasure();
    }

    public setDismissible(value: boolean): void {
        this.dismissible.set(value);
    }

    public attachContent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
        const portal = new ComponentPortal(component, this.config.viewContainerRef ?? null, injector);

        return this.portalOutlet.attachComponentPortal(portal);
    }

    ngOnDestroy(): void {
        this.surface.destroy();

        if (this.el.nativeElement.contains(document.activeElement)) {
            this.previouslyFocused?.focus();
        }
    }
}

function toCssLength(value: number | string | undefined, fallback: string): string {
    if (value === undefined) {
        return fallback;
    }

    return typeof value === 'number' ? `${value}px` : value;
}
