import { Component } from '@angular/core';
import { ChipSet, Chips, IconElement, InputElement, MaterialIcon } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-chips',
    imports: [
        ChipSet,
        Chips,
        IconElement,
        InputElement,
        MaterialIcon,
    ],
    templateUrl: './chips.component.html',
    styleUrl: './chips.component.scss',
})
export class ChipsComponent {
    public inputChips = [
        'Alex',
        'Material',
        'Design system',
    ];

    public removeInputChip(chip: string): void {
        this.inputChips = this.inputChips.filter((item) => item !== chip);
    }
}
