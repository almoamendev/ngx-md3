import { Component, computed, input, output, signal } from '@angular/core';
import { MenuGroup } from '../../menu/menu-group/menu-group';
import { MenuItem } from '../../menu/menu-item/menu-item';
import { SelectOption, SelectOptionValue } from '../../../types/select-option.type';

@Component({
    selector: 'md3-select-options',
    imports: [
        MenuGroup,
        MenuItem,
    ],
    templateUrl: './select-options.html',
    styleUrl: './select-options.scss',
})
export class SelectOptions {
    public options = input.required<SelectOption[]>();
    public multiple = input<boolean>(false);

    /**
     * The options left after the search filter of the field. SelectField writes into this
     * signal while the menu is open, because menu inputs are bound once, at open. null means
     * that no filter applies, so every option is shown.
     */
    public visibleOptions = signal<SelectOption[] | null>(null);

    /** Emits the values selected by the user. The field owns the selection state. */
    public selectionChange = output<SelectOptionValue[]>();

    protected renderedOptions = computed<SelectOption[]>(() => this.visibleOptions() ?? this.options());

    public optionClick(option: SelectOption) {
        const options = this.options();

        if (this.multiple()) {
            option.selected = !(option.selected ?? false);
        } else {
            options.forEach((item) => {
                item.selected = item === option;
            });
        }

        // Reported from the full list, so a selected option hidden by the search is kept.
        this.selectionChange.emit(
            options.filter((item) => item.selected).map((item) => item.value)
        );
    }
}
