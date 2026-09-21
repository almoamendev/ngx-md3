import { Component, effect, input, signal } from '@angular/core';
import { MenuGroup } from '../../menu/menu-group/menu-group';
import { MenuItem } from '../../menu/menu-item/menu-item';
import { SelectOption } from '../../../types/select-option.type';

type ValueType = (number | string)[] | null;

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

    public selectedOptions = signal<SelectOption[]>([]);

    constructor() {
        effect(() => {
            this.selectedOptions.set(this.options().filter((item) => item.selected));
        });
    }

    public optionClick(index: number) {
        const options = this.options();
        if (this.multiple()) {
            options.at(index)!.selected = !(options.at(index)!.selected ?? false);
        } else {
            options.forEach((item, i) => {
                item.selected = i == index;
            });
        }

        this.selectedOptions.set(options.filter((item) => item.selected));
    }
}
