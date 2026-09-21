import { Component, input, output } from '@angular/core';
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

    /** Emits the values selected by the user. The field owns the selection state. */
    public selectionChange = output<SelectOptionValue[]>();

    public optionClick(index: number) {
        const options = this.options();
        const option = options.at(index);
        if (!option) {
            return;
        }

        if (this.multiple()) {
            option.selected = !(option.selected ?? false);
        } else {
            options.forEach((item, i) => {
                item.selected = i == index;
            });
        }

        this.selectionChange.emit(
            options.filter((item) => item.selected).map((item) => item.value)
        );
    }
}
