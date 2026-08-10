import { Component, computed, contentChildren, input } from '@angular/core';
import { SelectOption } from '../select-option/select-option';

/** Heads a set of related options inside an md3-select. */
@Component({
    selector: 'md3-select-option-group',
    imports: [],
    templateUrl: './select-option-group.html',
    styleUrl: './select-option-group.scss',
    host: {
        'role': 'group',
        '[attr.aria-label]': 'label() || null',
        '[class.md3-hidden]': 'isHidden()',
    },
})
export class SelectOptionGroup {
    private readonly options = contentChildren(SelectOption, { descendants: true });

    public label = input<string>('', {
        alias: 'label',
    });

    /** A group whose every option has been filtered out goes with them. */
    public readonly isHidden = computed<boolean>(() => {
        const options = this.options();

        return options.length > 0 && options.every((option) => option.isHidden());
    });
}
