import { Highlightable } from '@angular/cdk/a11y';
import {
    booleanAttribute,
    Component,
    computed,
    contentChildren,
    effect,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { IconElement } from '../../common/icon-element';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { StateComponent } from '../../common/state-component';
import { TypeBody } from '../../../styles/typography/type-body';
import { TypeLabel } from '../../../styles/typography/type-label';
import { MD3_SELECT_CONTEXT } from '../../../interfaces/select-context.interface';
import { isValueSelected } from '../select-selection';

let nextOptionId = 0;

/**
 * One choice inside an md3-select. Options are declared by the consumer as content of the
 * select and rendered into its panel, so they exist whether or not the panel is open — which is
 * what lets the closed field name what is selected.
 *
 * An option is not focusable and is not a form control: the field keeps focus and points here
 * with aria-activedescendant. It implements the CDK's Highlightable so the select's key manager
 * can drive it.
 */
@Component({
    selector: 'md3-select-option',
    imports: [
        StateComponent,
        MaterialIcon,
        TypeLabel,
        TypeBody,
    ],
    templateUrl: './select-option.html',
    styleUrl: './select-option.scss',
    host: {
        'role': 'option',
        '[attr.id]': 'id',
        '[attr.aria-selected]': 'isSelected()',
        '[attr.aria-disabled]': 'disabled ? "true" : null',
        '[class.md3-selected]': 'isSelected()',
        '[class.md3-active]': 'isActive()',
        '[class.md3-hidden]': 'isHidden()',
        '[class.md3-disabled]': 'disabled',
        '(click)': 'onClick()',
        '(pointerdown)': 'onPointerDown($event)',
    },
})
export class SelectOption<T = any> implements Highlightable {
    private readonly context = inject(MD3_SELECT_CONTEXT, { optional: true });
    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly content = viewChild<ElementRef<HTMLElement>>('content');
    protected readonly leadingIcons = contentChildren(IconElement);

    /** Identifies the option to aria-activedescendant. */
    public readonly id = `md3-select-option-${nextOptionId++}`;

    public value = input.required<T>();

    public disabledOption = input<boolean, unknown>(false, {
        alias: 'disabled',
        transform: booleanAttribute,
    });

    /**
     * What this option reads as in the closed field and to typeahead. Defaults to the option's
     * own text, which is only worth overriding when the content is richer than a plain label.
     */
    public label = input<string | null>(null, {
        alias: 'label',
    });

    public supportingText = input<string | null>(null, {
        alias: 'supporting-text',
    });

    /** The option's own text, kept current as the projected content changes. */
    private readonly projectedText = signal<string>('');

    public readonly isActive = signal<boolean>(false);

    public readonly viewValue = computed<string>(() => this.label() ?? this.projectedText());

    public readonly isSelected = computed<boolean>(() => {
        if (!this.context) {
            return false;
        }

        return isValueSelected(this.context.selection(), this.value(), this.context.compareWith());
    });

    /**
     * Options are the consumer's, so a search hides them rather than removing them. Manual
     * filtering means the consumer is choosing what to render and nothing is hidden here.
     */
    public readonly isHidden = computed<boolean>(() => {
        if (!this.context || this.context.filterMode() === 'manual') {
            return false;
        }

        const query = this.context.searchQuery().trim().toLowerCase();

        return query.length > 0 && !this.viewValue().toLowerCase().includes(query);
    });

    protected readonly showLeadingIcon = computed<boolean>(() => {
        return this.leadingIcons().length > 0 || this.isSelected();
    });

    constructor() {
        effect((onCleanup) => {
            const content = this.content()?.nativeElement;

            if (!content) {
                return;
            }

            const read = (): void => this.projectedText.set(content.textContent?.trim() ?? '');

            read();

            const observer = typeof MutationObserver === 'undefined'
                ? undefined
                : new MutationObserver(read);

            observer?.observe(content, { childList: true, characterData: true, subtree: true });

            onCleanup(() => observer?.disconnect());
        });

        // The select remembers what each value reads as, so a selection keeps its name in the
        // closed field even once this option is filtered out or replaced by a server response.
        effect(() => this.context?.registerLabel(this.value(), this.viewValue()));
    }

    /** Plain boolean rather than the signal, because the CDK's key manager reads it directly. */
    public get disabled(): boolean {
        return this.disabledOption();
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public getLabel(): string {
        return this.viewValue();
    }

    public setActiveStyles(): void {
        this.isActive.set(true);
    }

    public setInactiveStyles(): void {
        this.isActive.set(false);
    }

    protected onClick(): void {
        if (this.disabled) {
            return;
        }

        this.context?.selectValue(this.value());
    }

    protected onPointerDown(event: PointerEvent): void {
        // Keep focus in the select's field. The panel is driven by aria-activedescendant, and
        // blurring here would drop the caret and unfloat the label mid-search.
        event.preventDefault();
    }
}
