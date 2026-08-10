import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    booleanAttribute,
    Component,
    computed,
    contentChildren,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    model,
    OnDestroy,
    output,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { IconButton } from '../buttons/icon-button/icon-button';
import { IconElement } from '../common/icon-element';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { LinearProgressIndicator } from '../loading-and-progress/linear-progress-indicator/linear-progress-indicator';
import { SupportingText } from '../text-field/supporting-text';
import { TextField } from '../text-field/text-field';
import { SelectOption } from './select-option/select-option';
import { scrollTopForOption } from './select-scroll';
import {
    externalValue,
    normalizeValue,
    SelectComparator,
    toggleValue,
    valuesEqual,
} from './select-selection';
import { buildTriggerLabel } from './select-trigger-label';
import { MD3_SELECT_CONTEXT, SelectContext } from '../../interfaces/select-context.interface';
import { SelectFilterMode } from '../../types/select-filter-mode.type';
import { TextFieldType } from '../../types/text-field-type.type';

/** Long enough to outlast the panel's exit transition, which transitionend usually beats. */
const PANEL_EXIT_FALLBACK_MS = 300;
const TYPEAHEAD_DEBOUNCE_MS = 200;
const PANEL_OFFSET_PX = 4;
const VIEWPORT_MARGIN_PX = 8;

/**
 * How many values the field remembers the wording of. Selections are kept whatever happens, so
 * this only bounds the names of values that are no longer picked.
 */
const LABEL_CACHE_LIMIT = 256;

let nextPanelId = 0;

interface SelectLabel<T> {
    value: T;
    label: string;
}

interface PendingDetach {
    timer: ReturnType<typeof setTimeout>;
    panel: HTMLElement | null;
    listener: (event: TransitionEvent) => void;
}

/**
 * Material 3 select. The closed control is a text field — the same chrome, states and error
 * handling — and opening it shows a menu-like panel of the options declared inside it.
 *
 * It takes one value or many, and can turn its own field into a search box that filters the
 * options as you type. Values are held here rather than on a native element, so unlike the rest
 * of the library's inputs this one is a ControlValueAccessor: `formControlName`, `formControl`
 * and `ngModel` bind to `md3-select` itself.
 */
@Component({
    selector: 'md3-select',
    imports: [
        TextField,
        InputElement,
        IconElement,
        IconButton,
        MaterialIcon,
        SupportingText,
        LinearProgressIndicator,
    ],
    templateUrl: './select.html',
    styleUrl: './select.scss',
    host: {
        '[class.md3-open]': 'isOpen()',
        '[class.md3-searching]': 'isSearchInput()',
    },
    providers: [
        {
            provide: MD3_SELECT_CONTEXT,
            useExisting: Select,
        },
    ],
})
export class Select<T = any> implements SelectContext<T>, ControlValueAccessor, OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly injector = inject(Injector);
    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly directionality = inject(Directionality, { optional: true });
    // Self-injected rather than provided as NG_VALUE_ACCESSOR: it registers the accessor and
    // hands over the control, so error styling works for formControlName, formControl and
    // ngModel without the consumer also passing [control].
    private readonly ngControl = inject(NgControl, { optional: true, self: true });

    private readonly field = viewChild('field', { read: ElementRef<HTMLElement> });
    private readonly trigger = viewChild<ElementRef<HTMLInputElement>>('trigger');
    private readonly measure = viewChild<ElementRef<HTMLElement>>('measure');
    private readonly panelTemplate = viewChild<TemplateRef<unknown>>('panelTemplate');

    public readonly options = contentChildren(SelectOption, { descendants: true });

    public readonly panelId = `md3-select-panel-${nextPanelId++}`;

    public label = input<string | null>(null, {
        alias: 'label',
    });
    public fieldType = input<TextFieldType>('filled', {
        alias: 'field-type',
    });
    /** Material icon name shown at the start of the field. */
    public leadingIcon = input<string | null>(null, {
        alias: 'leading-icon',
    });
    public supportingText = input<string | null>(null, {
        alias: 'supporting-text',
    });
    /** Only read for error styling; the value is bound through forms or [(value)]. */
    public control = input<AbstractControl | undefined>(undefined, {
        alias: 'control',
    });
    public multiple = input<boolean, unknown>(false, {
        alias: 'multiple',
        transform: booleanAttribute,
    });
    public searchable = input<boolean, unknown>(false, {
        alias: 'searchable',
        transform: booleanAttribute,
    });
    public filterMode = input<SelectFilterMode>('auto', {
        alias: 'filter-mode',
    });
    public loading = input<boolean, unknown>(false, {
        alias: 'loading',
        transform: booleanAttribute,
    });
    public disabledSelect = input<boolean, unknown>(false, {
        alias: 'disabled',
        transform: booleanAttribute,
    });
    public required = input<boolean, unknown>(false, {
        alias: 'required',
        transform: booleanAttribute,
    });
    public clearable = input<boolean, unknown>(false, {
        alias: 'clearable',
        transform: booleanAttribute,
    });
    /** How two values are told apart. Object values need one of these. */
    public compareWith = input<SelectComparator<T>>((a: T, b: T) => a === b, {
        alias: 'compare-with',
    });
    public maxVisibleSelections = input<number | 'auto'>('auto', {
        alias: 'max-visible-selections',
    });
    public searchDebounce = input<number>(0, {
        alias: 'search-debounce',
    });
    public emptyText = input<string>('No results', {
        alias: 'empty-text',
    });

    public value = model<T | T[] | null>(null, {
        alias: 'value',
    });

    public searchChange = output<string>();
    public openedChange = output<boolean>();

    public readonly selection = signal<readonly T[]>([]);
    public readonly searchQuery = signal<string>('');

    private readonly opened = signal<boolean>(false);
    private readonly cvaDisabled = signal<boolean>(false);
    private readonly ngControlSignal = signal<AbstractControl | undefined>(undefined);
    private readonly labels = signal<readonly SelectLabel<T>[]>([]);
    private readonly visibleSelectionCount = signal<number>(1);
    private readonly activeOption = signal<SelectOption<T> | null>(null);

    protected readonly panelVisible = signal<boolean>(false);

    public readonly isOpen = this.opened.asReadonly();

    protected readonly isSearchInput = computed<boolean>(() => this.searchable() && this.opened());
    protected readonly isDisabled = computed<boolean>(() => this.disabledSelect() || this.cvaDisabled());
    protected readonly errorControl = computed<AbstractControl | undefined>(() => {
        return this.control() ?? this.ngControlSignal();
    });
    protected readonly showClear = computed<boolean>(() => {
        return this.clearable() && !this.isDisabled() && this.selection().length > 0;
    });
    protected readonly activeOptionId = computed<string | null>(() => {
        return this.opened() ? this.activeOption()?.id ?? null : null;
    });
    protected readonly isEmpty = computed<boolean>(() => {
        const options = this.options();

        return !this.loading() && (options.length === 0 || options.every((option) => option.isHidden()));
    });

    /** What the closed field reads as. */
    private readonly triggerText = computed<string>(() => {
        const labels = this.selection().map((value) => this.labelFor(value));

        return buildTriggerLabel(labels, this.visibleSelectionCount());
    });

    private overlayRef?: OverlayRef;
    private portal?: TemplatePortal;
    private keyManager?: ActiveDescendantKeyManager<SelectOption<T>>;
    private fieldResize?: ResizeObserver;
    private pendingDetach?: PendingDetach;
    private searchTimer?: ReturnType<typeof setTimeout>;

    private onChangeFn: (value: T | T[] | null) => void = () => undefined;
    private onTouchedFn: () => void = () => undefined;

    /**
     * The value this component last pushed into the model, so the effect watching [(value)] can
     * tell its own write apart from a real binding change and leave a form value alone.
     */
    private lastAppliedValue: T | T[] | null = null;

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }

        effect(() => {
            const bound = this.value();

            if (Object.is(bound, this.lastAppliedValue)) {
                return;
            }

            this.applySelection(normalizeValue(bound, this.multiple()), 'programmatic');
        });

        effect(() => {
            this.selection();
            this.labels();
            this.maxVisibleSelections();
            this.updateVisibleSelectionCount();
        });

        effect(() => this.syncTriggerValue());
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public open(): void {
        if (this.opened() || this.isDisabled()) {
            return;
        }

        const template = this.panelTemplate();
        const field = this.fieldElement();

        if (!template || !field) {
            return;
        }

        // Re-opening while the last close is still animating out keeps the same view.
        this.clearPendingDetach();

        const overlayRef = this.createOverlay(field);

        overlayRef.updateSize({ width: field.getBoundingClientRect().width });

        if (!overlayRef.hasAttached()) {
            this.portal ??= new TemplatePortal(template, this.viewContainerRef);
            overlayRef.attach(this.portal);
        }

        this.opened.set(true);
        this.searchQuery.set('');
        this.watchFieldSize(field, overlayRef);
        this.preventBackdropFocusSteal(overlayRef);
        this.activateInitialOption();
        this.openedChange.emit(true);

        requestAnimationFrame(() => {
            this.panelVisible.set(true);
            overlayRef.updatePosition();
        });
    }

    public close(): void {
        if (!this.opened()) {
            return;
        }

        this.opened.set(false);
        this.panelVisible.set(false);
        this.searchQuery.set('');
        this.stopWatchingFieldSize();
        this.scheduleDetach();
        this.openedChange.emit(false);
        this.onTouchedFn();
    }

    public toggle(): void {
        if (this.opened()) {
            this.close();
        } else {
            this.open();
        }
    }

    // SelectContext -----------------------------------------------------------------------

    public selectValue(value: T): void {
        const next = toggleValue(this.selection(), value, this.multiple(), this.compareWith());

        this.applySelection(next, 'user');

        if (!this.multiple()) {
            this.close();
            this.trigger()?.nativeElement.focus();
        }
    }

    public registerLabel(value: T, label: string): void {
        if (!label) {
            return;
        }

        const compare = this.compareWith();
        const current = this.labels();
        const existing = current.find((entry) => compare(entry.value, value));

        if (existing) {
            if (existing.label === label) {
                return;
            }

            this.labels.set(current.map((entry) => {
                return entry === existing ? { value, label } : entry;
            }));

            return;
        }

        this.labels.set(this.pruneLabels([...current, { value, label }]));
    }

    // ControlValueAccessor ----------------------------------------------------------------

    public writeValue(value: T | T[] | null): void {
        this.applySelection(normalizeValue(value, this.multiple()), 'programmatic');
    }

    public registerOnChange(fn: (value: T | T[] | null) => void): void {
        this.onChangeFn = fn;

        // The control is assigned by the time the accessor is wired up, but not at construction,
        // which is why it is picked up here rather than in a lifecycle hook.
        this.ngControlSignal.set(this.ngControl?.control ?? undefined);
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouchedFn = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.cvaDisabled.set(isDisabled);

        if (isDisabled) {
            this.close();
        }
    }

    ngOnDestroy(): void {
        this.clearPendingDetach();
        this.stopWatchingFieldSize();
        clearTimeout(this.searchTimer);
        this.keyManager?.destroy();
        this.overlayRef?.dispose();
        this.overlayRef = undefined;
    }

    // Template handlers -------------------------------------------------------------------

    /**
     * Opens, and only opens. While the panel is up the backdrop covers the field, so the click
     * that closes it never reaches here and there is no toggling to get wrong.
     *
     * This is on `click` rather than `pointerdown` on purpose: the text field's container is a
     * <label> around the input, so clicking the field's padding is forwarded to the input as a
     * click — pointerdown is not forwarded, and those clicks would do nothing.
     */
    protected onTriggerClick(): void {
        if (this.isDisabled()) {
            return;
        }

        this.open();
    }

    protected onTriggerKeydown(event: KeyboardEvent): void {
        if (this.isDisabled()) {
            return;
        }

        if (!this.opened()) {
            this.onClosedKeydown(event);

            return;
        }

        switch (event.key) {
            case 'Escape':
                if (hasModifierKey(event)) {
                    return;
                }

                event.preventDefault();
                // Without this an enclosing dialog would take the same Escape and close too.
                event.stopPropagation();
                this.close();

                return;

            case 'Tab':
                this.close();

                return;

            case 'Enter':
                event.preventDefault();
                this.selectActiveOption();

                return;

            case ' ':
                if (this.isSearchInput()) {
                    // The search box owns the space bar.
                    break;
                }

                event.preventDefault();
                this.selectActiveOption();

                return;

            case 'ArrowUp':
                if (event.altKey) {
                    event.preventDefault();
                    this.close();

                    return;
                }

                break;
        }

        this.keyManager?.onKeydown(event);
        this.scrollActiveIntoView();
    }

    protected onSearchInput(event: Event): void {
        if (!this.isSearchInput()) {
            return;
        }

        const query = (event.target as HTMLInputElement).value;
        const debounce = this.searchDebounce();

        clearTimeout(this.searchTimer);

        if (debounce > 0) {
            this.searchTimer = setTimeout(() => this.applySearch(query), debounce);

            return;
        }

        this.applySearch(query);
    }

    protected onTriggerBlur(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        const overlayElement = this.overlayRef?.overlayElement;

        // Focus landed on the panel itself, its padding or its scrollbar. The field keeps focus
        // while the panel is open, so take it back rather than closing.
        if (this.opened() && next && overlayElement?.contains(next)) {
            this.trigger()?.nativeElement.focus();

            return;
        }

        if (!this.opened()) {
            this.onTouchedFn();
        }
    }

    protected onClearClick(event: MouseEvent): void {
        // preventDefault stops the enclosing <label> forwarding this click to the input, which
        // would open the panel the clear button was meant to leave alone.
        event.preventDefault();
        event.stopPropagation();

        this.applySelection([], 'user');
    }

    // Selection ---------------------------------------------------------------------------

    private applySelection(next: readonly T[], source: 'user' | 'programmatic'): void {
        if (valuesEqual(this.selection(), next, this.compareWith())) {
            return;
        }

        this.selection.set([...next]);

        const external = externalValue(next, this.multiple());

        this.lastAppliedValue = external;
        this.value.set(external);

        if (source === 'user') {
            this.onChangeFn(external);
        }
    }

    private selectActiveOption(): void {
        const active = this.keyManager?.activeItem;

        if (!active || active.disabled || active.isHidden()) {
            return;
        }

        this.selectValue(active.value());
    }

    private labelFor(value: T): string {
        const compare = this.compareWith();
        const entry = this.labels().find((candidate) => compare(candidate.value, value));

        return entry?.label ?? String(value);
    }

    /** Drops the wording of values nobody has picked once the cache outgrows its limit. */
    private pruneLabels(labels: readonly SelectLabel<T>[]): SelectLabel<T>[] {
        if (labels.length <= LABEL_CACHE_LIMIT) {
            return [...labels];
        }

        const compare = this.compareWith();
        const selection = this.selection();
        const isSelected = (entry: SelectLabel<T>): boolean => {
            return selection.some((value) => compare(value, entry.value));
        };

        const kept = labels.filter(isSelected);
        const rest = labels.filter((entry) => !isSelected(entry));

        return [...kept, ...rest.slice(rest.length - (LABEL_CACHE_LIMIT - kept.length))];
    }

    // Trigger ------------------------------------------------------------------------------

    private fieldElement(): HTMLElement | null {
        return this.field()?.nativeElement ?? null;
    }

    /**
     * Written straight onto the input rather than bound. Angular skips a property binding whose
     * expression has not changed since it last wrote it, and a search types over the DOM value
     * behind the binding's back — so restoring the previous text on close would be skipped.
     */
    private syncTriggerValue(): void {
        const input = this.trigger()?.nativeElement;

        if (!input) {
            return;
        }

        const next = this.isSearchInput() ? this.searchQuery() : this.triggerText();

        if (input.value !== next) {
            input.value = next;
        }
    }

    private updateVisibleSelectionCount(): void {
        const max = this.maxVisibleSelections();

        if (max !== 'auto') {
            this.visibleSelectionCount.set(Math.max(1, Math.floor(max)));

            return;
        }

        this.visibleSelectionCount.set(this.measureVisibleCount());
    }

    /** Largest number of selections whose joined text still fits on the field's single line. */
    private measureVisibleCount(): number {
        const labels = this.selection().map((value) => this.labelFor(value));

        if (labels.length <= 1) {
            return 1;
        }

        const input = this.trigger()?.nativeElement;
        const measure = this.measure()?.nativeElement;

        if (!input || !measure) {
            return labels.length;
        }

        const styles = getComputedStyle(input);
        const available = input.clientWidth
            - parseFloat(styles.paddingInlineStart || '0')
            - parseFloat(styles.paddingInlineEnd || '0');

        if (!(available > 0)) {
            return labels.length;
        }

        measure.style.fontFamily = styles.fontFamily;
        measure.style.fontSize = styles.fontSize;
        measure.style.fontWeight = styles.fontWeight;
        measure.style.fontStyle = styles.fontStyle;
        measure.style.letterSpacing = styles.letterSpacing;

        for (let count = labels.length; count > 1; count--) {
            measure.textContent = buildTriggerLabel(labels, count);

            if (measure.scrollWidth <= available) {
                return count;
            }
        }

        return 1;
    }

    // Search -------------------------------------------------------------------------------

    private applySearch(query: string): void {
        this.searchQuery.set(query);
        this.searchChange.emit(query);

        // Option visibility is computed, so it is already current here; the first still-visible
        // option becomes the one Enter would take.
        this.keyManager?.setFirstItemActive();
        this.scrollActiveIntoView();
        this.overlayRef?.updatePosition();
    }

    // Keyboard -----------------------------------------------------------------------------

    private onClosedKeydown(event: KeyboardEvent): void {
        const key = event.key;

        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter'
            || (key === ' ' && !this.searchable())) {
            event.preventDefault();
            this.open();

            return;
        }

        // Typing on a closed, non-searchable select picks straight from the list, the way a
        // native select does.
        if (!this.searchable() && this.isPrintableKey(event)) {
            const manager = this.ensureKeyManager();

            manager.onKeydown(event);

            const active = manager.activeItem;

            if (active && !this.multiple()) {
                this.selectValue(active.value());
            }
        }
    }

    private isPrintableKey(event: KeyboardEvent): boolean {
        return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    }

    private ensureKeyManager(): ActiveDescendantKeyManager<SelectOption<T>> {
        if (this.keyManager) {
            return this.keyManager;
        }

        const manager = new ActiveDescendantKeyManager<SelectOption<T>>(this.options, this.injector)
            .withWrap()
            .withHomeAndEnd()
            .withPageUpDown()
            // Options expose `disabled` as a plain boolean for this reason: a signal would be a
            // function, which is always truthy, and the default predicate would skip every one.
            .skipPredicate((option) => option.disabled || option.isHidden());

        if (!this.searchable()) {
            manager.withTypeAhead(TYPEAHEAD_DEBOUNCE_MS);
        }

        manager.change.subscribe(() => this.activeOption.set(manager.activeItem ?? null));

        this.keyManager = manager;

        return manager;
    }

    private activateInitialOption(): void {
        const manager = this.ensureKeyManager();
        const selected = this.options().find((option) => {
            return option.isSelected() && !option.disabled && !option.isHidden();
        });

        if (selected) {
            manager.setActiveItem(selected);
        } else {
            manager.setFirstItemActive();
        }

        this.activeOption.set(manager.activeItem ?? null);
        this.scrollActiveIntoView();
    }

    private scrollActiveIntoView(): void {
        const active = this.keyManager?.activeItem;
        const scroller = this.overlayRef?.overlayElement
            .querySelector<HTMLElement>('.md3-select-panel-options');

        if (!active || !scroller) {
            return;
        }

        scroller.scrollTop = scrollTopForOption({
            optionTop: active.element.offsetTop,
            optionHeight: active.element.offsetHeight,
            scrollTop: scroller.scrollTop,
            viewportHeight: scroller.clientHeight,
        });
    }

    // Overlay ------------------------------------------------------------------------------

    private createOverlay(field: HTMLElement): OverlayRef {
        if (this.overlayRef) {
            return this.overlayRef;
        }

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(field)
            .withFlexibleDimensions(false)
            .withGrowAfterOpen(true)
            .withPush(true)
            .withViewportMargin(VIEWPORT_MARGIN_PX)
            .withTransformOriginOn('.md3-select-panel')
            .withPositions([
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                    offsetY: PANEL_OFFSET_PX,
                    panelClass: 'md3-select-below',
                },
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom',
                    offsetY: -PANEL_OFFSET_PX,
                    panelClass: 'md3-select-above',
                },
            ]);

        const overlayRef = this.overlay.create(new OverlayConfig({
            // The backdrop swallows the click that closes the panel, the way a native select
            // does, and covers the field so the trigger never sees it.
            hasBackdrop: true,
            backdropClass: 'md3-select-scrim',
            panelClass: 'md3-select-overlay-panel',
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            direction: this.directionality ?? undefined,
        }));

        overlayRef.backdropClick().subscribe(() => this.close());

        this.overlayRef = overlayRef;

        return overlayRef;
    }

    /**
     * Pressing on the backdrop would otherwise blur the field, dropping the caret and unfloating
     * the label mid-search. Preventing the default suppresses the focus change without cancelling
     * the click, so the panel still closes.
     */
    private preventBackdropFocusSteal(overlayRef: OverlayRef): void {
        overlayRef.backdropElement?.addEventListener('pointerdown', (event) => {
            event.preventDefault();
        });
    }

    private watchFieldSize(field: HTMLElement, overlayRef: OverlayRef): void {
        this.stopWatchingFieldSize();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        // The position strategy re-runs on a viewport resize by itself, but it never touches
        // width, and the panel is meant to stay exactly as wide as the field.
        this.fieldResize = new ResizeObserver(() => {
            overlayRef.updateSize({ width: field.getBoundingClientRect().width });
            overlayRef.updatePosition();
        });

        this.fieldResize.observe(field);
    }

    private stopWatchingFieldSize(): void {
        this.fieldResize?.disconnect();
        this.fieldResize = undefined;
    }

    private scheduleDetach(): void {
        const overlayRef = this.overlayRef;

        if (!overlayRef?.hasAttached()) {
            return;
        }

        const panel = overlayRef.overlayElement.querySelector<HTMLElement>('.md3-select-panel');

        const done = (): void => {
            this.clearPendingDetach();

            if (!this.opened() && overlayRef.hasAttached()) {
                overlayRef.detach();
            }
        };

        const listener = (event: TransitionEvent): void => {
            if (event.target === panel) {
                done();
            }
        };

        panel?.addEventListener('transitionend', listener);

        this.pendingDetach = {
            panel,
            listener,
            timer: setTimeout(done, PANEL_EXIT_FALLBACK_MS),
        };
    }

    private clearPendingDetach(): void {
        if (!this.pendingDetach) {
            return;
        }

        const { timer, panel, listener } = this.pendingDetach;

        clearTimeout(timer);
        panel?.removeEventListener('transitionend', listener);
        this.pendingDetach = undefined;
    }
}
