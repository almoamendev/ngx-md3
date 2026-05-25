import { Component } from '@angular/core';
import { ChipAvatar, Chips, IconElement, InputElement, MaterialIcon, TextFieldModule } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-chips',
    imports: [
        Chips,
        ChipAvatar,
        IconElement,
        InputElement,
        MaterialIcon,
        TextFieldModule
    ],
    templateUrl: './chips.component.html',
    styleUrl: './chips.component.scss',
})
export class ChipsComponent {
    public inputChips = [
        'Alex',
        'Material',
        'Design system',
        'Angular',
        'Components',
        'Accessibility',
    ];

    public removeChip(index: number): void {
        this.inputChips.splice(index, 1);
    }

    public addChip(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.trim();
        if (value.length) {
            this.inputChips.push(value);
        }
        input.value = '';
    }
}
