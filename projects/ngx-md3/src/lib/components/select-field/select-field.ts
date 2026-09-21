import { booleanAttribute, Component, computed, contentChildren, effect, ElementRef, inject, input, signal, untracked, viewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { TextField } from '../text-field/text-field';
import { IconElement } from '../common/icon-element';
import { IconButton } from '../buttons/icon-button/icon-button';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { MenuService } from '../menu/menu.service';
import { SelectOptions } from './select-options/select-options';
import { MenuRef } from '../menu/menu-ref';
import { SelectFieldValue, SelectOption, SelectOptionValue } from '../../types/select-option.type';

@Component({
    selector: 'md3-select-field',
    imports: [
        TextField,
        IconElement,
        IconButton,
        InputElement,
        MaterialIcon,
    ],
    templateUrl: './select-field.html',
    styleUrl: './select-field.scss',
})
export class SelectField implements ControlValueAccessor {
    /**
     * Form directive placed on the host element: [formControl], formControlName or [(ngModel)].
     * The accessor is registered from the constructor instead of through an NG_VALUE_ACCESSOR
     * provider, which keeps the directive injectable here and gives access to the control
     * itself for the error state forwarded to md3-text-field.
     */
    private readonly ngControl = inject(NgControl, { self: true, optional: true });

    public options = input.required<SelectOption[]>();
    public multiple = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    public label = input<string | null>(null, {
        alias: 'label',
    });

    /**
     * Formats the text shown in the field. The default joins the labels of the selected
     * options with a comma, so the field shows as many labels as its width allows.
     * The formatter is not called for an empty selection: the field stays empty, which keeps
     * the floating label in its place.
     */
    public displayWith = input<((selected: SelectOption[]) => string) | null>(null, {
        alias: 'display-with',
    });

    /**
     * Disables the field outside of a form. With reactive forms prefer control.disable().
     */
    public disabled = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    public menuColors = input<'standard' | 'vibrant'>('standard', {
        alias: 'menu-colors',
    });
    public fieldType = input<'filled' | 'outlined'>('filled', {
        alias: 'field-type',
    });

    /**
     * Control passed explicitly, mirroring md3-text-field. Takes precedence over a form
     * directive on the host element.
     */
    public control = input<AbstractControl | undefined>(undefined, {
        alias: 'control',
    });

    private iconElements = contentChildren(IconElement, { descendants: true });
    public hasLeadingIcon = computed<boolean>(() => this.iconElements().some(i => i.iconType() === 'leading') ?? false);
    public hasArrowIcon = computed<boolean>(() => this.iconElements().some(i => i.iconType() === 'arrow') ?? false);

    protected isMenuOpen = signal<boolean>(false);
    private menuRef: MenuRef<SelectOptions, unknown> | null = null;
    private inputElement = viewChild(InputElement, { read: ElementRef });

    /** Control resolved from the host form directive, captured when the accessor is wired up. */
    private hostControl = signal<AbstractControl | undefined>(undefined);
    /** Disabled state pushed by the control, either through setDisabledState or control.disabled. */
    private controlDisabled = signal<boolean>(false);
    /**
     * Set as soon as a control writes a value. From then on the control owns the selection and
     * SelectOption.selected no longer seeds it.
     */
    private controlOwnsValue = false;

    private onChange: (value: SelectFieldValue) => void = () => { };
    private onTouched: () => void = () => { };

    /** Selection is kept by value so it survives options arriving or being replaced later. */
    private selectedValues = signal<SelectOptionValue[]>([]);

    public formControl = computed<AbstractControl | undefined>(() => this.control() ?? this.hostControl());

    public isDisabled = computed<boolean>(() => this.disabled() || this.controlDisabled());

    public selectedOptions = computed<SelectOption[]>(() => {
        const values = this.selectedValues();
        return this.options().filter((option) => values.includes(option.value));
    });

    public selectedText = computed<string | null>(() => {
        const selected = this.selectedOptions();
        if (selected.length == 0) {
            return null;
        }

        const format = this.displayWith();
        if (format) {
            return format(selected);
        }

        return selected.map((option) => option.label).join(', ');
    });

    constructor(
        private menuService: MenuService,
        private viewContainerRef: ViewContainerRef,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }

        // Seeds the selection from SelectOption.selected while no control owns the value.
        effect(() => {
            const options = this.options();

            untracked(() => {
                if (this.controlOwnsValue) {
                    return;
                }

                let selected = options.filter((option) => option.selected);
                if (!this.multiple() && selected.length > 1) {
                    selected = [selected[0]];
                }

                this.setSelectedValues(selected.map((option) => option.value));
            });
        });

        // Mirrors the selection back onto SelectOption.selected so the menu renders it.
        effect(() => {
            const values = this.selectedValues();

            for (const option of this.options()) {
                option.selected = values.includes(option.value);
            }
        });

        // [control] is bound manually; [formControl]/formControlName go through the accessor API.
        effect((onCleanup) => {
            const control = this.control();
            if (!control) {
                return;
            }

            this.syncFromControl(control);

            const controlEvents = control.events.subscribe(() => this.syncFromControl(control));

            onCleanup(() => controlEvents.unsubscribe());
        });

        effect(() => {
            const isOpen = this.isMenuOpen();

            untracked(() => {
                if (isOpen) {
                    this.openSelectOptions();
                    return;
                }

                this.menuRef?.close();
                this.menuRef = null;
            });
        });
    }

    // ControlValueAccessor

    public writeValue(value: SelectFieldValue): void {
        this.captureHostControl();
        this.controlOwnsValue = true;
        this.setSelectedValues(this.normalizeValues(value));
    }

    public registerOnChange(fn: (value: SelectFieldValue) => void): void {
        this.captureHostControl();
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.controlDisabled.set(isDisabled);
    }

    // Menu

    public openMenu() {
        if (this.isDisabled()) {
            return;
        }

        this.isMenuOpen.set(true);
    }

    public closeMenu() {
        this.isMenuOpen.set(false);
    }

    public toggleMenu() {
        if (this.isDisabled()) {
            return;
        }

        this.isMenuOpen.update(current => !current);
    }

    private openSelectOptions() {
        this.menuRef = this.menuService.open(SelectOptions, {
            data: {
                options: this.options(),
                multiple: this.multiple(),
            },
            bindDataToInputs: true,
            menuColors: this.menuColors(),
            origin: this.inputElement(),
            xPosition: 'start',
            yPosition: 'below',
            overlapTrigger: false,
            // scrollStrategy: 'close',
            viewContainerRef: this.viewContainerRef,
        });

        this.menuRef.componentInstance?.selectionChange.subscribe((values) => this.selectValues(values));

        this.menuRef.afterClosed().subscribe(() => {
            this.isMenuOpen.set(false);
            this.markAsTouched();
        });
    }

    // Selection

    private selectValues(values: SelectOptionValue[]): void {
        this.setSelectedValues(this.normalizeValues(values));
        this.commitValue();
    }

    private setSelectedValues(values: SelectOptionValue[]): void {
        const current = untracked(this.selectedValues);
        if (current.length === values.length && current.every((value, index) => value === values[index])) {
            return;
        }

        this.selectedValues.set(values);
    }

    private commitValue(): void {
        const value = this.currentValue();

        // No-op unless a form directive registered an accessor callback.
        this.onChange(value);

        const control = this.control();
        if (control && !this.valuesAreEqual(control.value, value)) {
            control.markAsDirty();
            control.setValue(value);
        }
    }

    private currentValue(): SelectFieldValue {
        const values = untracked(this.selectedValues);

        if (this.multiple()) {
            return [...values];
        }

        return values.length > 0 ? values[0] : null;
    }

    private markAsTouched(): void {
        this.onTouched();

        const control = this.control();
        if (control && !control.touched) {
            control.markAsTouched();
        }
    }

    private syncFromControl(control: AbstractControl): void {
        this.controlOwnsValue = true;
        this.setSelectedValues(this.normalizeValues(control.value));
        this.controlDisabled.set(control.disabled);
    }

    private captureHostControl(): void {
        const control = this.ngControl?.control ?? undefined;
        if (control && untracked(this.hostControl) !== control) {
            this.hostControl.set(control);
        }
    }

    /**
     * Accepts whatever a control holds and reduces it to the option values this field can show:
     * a single value for single selection, a de-duplicated list for multiple selection.
     */
    private normalizeValues(value: unknown): SelectOptionValue[] {
        const values = (Array.isArray(value) ? value : [value])
            .filter((item): item is SelectOptionValue => typeof item === 'string' || typeof item === 'number');

        const unique = [...new Set(values)];

        return this.multiple() ? unique : unique.slice(0, 1);
    }

    private valuesAreEqual(current: unknown, next: SelectFieldValue): boolean {
        if (Array.isArray(current) && Array.isArray(next)) {
            return current.length === next.length && current.every((value, index) => value === next[index]);
        }

        return current === next;
    }
}
