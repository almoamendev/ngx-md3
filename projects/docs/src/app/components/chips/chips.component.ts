import { Component } from '@angular/core';
import {
    ChipSet,
    Chips,
    IconElement,
    InputElement,
    MaterialIcon,
    TextFieldModule,
} from '@vip9008/ngx-md3';

@Component({
    selector: 'app-chips',
    imports: [
        ChipSet,
        Chips,
        IconElement,
        InputElement,
        MaterialIcon,
        TextFieldModule,
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
    public inlineTags = [
        'Angular',
        'Components',
    ];
    public inlineTagDraft = '';
    public textFieldTags = [
        'Material',
        'Accessibility',
    ];
    public textFieldTagDraft = '';

    public removeInputChip(chip: string): void {
        this.inputChips = this.inputChips.filter((item) => item !== chip);
    }

    public onInlineTagInput(event: Event): void {
        this.inlineTagDraft = this.getInputValue(event);
    }

    public onInlineTagKeydown(event: KeyboardEvent): void {
        this.handleTagKeydown(event, 'inline');
    }

    public removeInlineTag(tag: string): void {
        this.inlineTags = this.inlineTags.filter((item) => item !== tag);
    }

    public onTextFieldTagInput(event: Event): void {
        this.textFieldTagDraft = this.getInputValue(event);
    }

    public onTextFieldTagKeydown(event: KeyboardEvent): void {
        this.handleTagKeydown(event, 'text-field');
    }

    public removeTextFieldTag(tag: string): void {
        this.textFieldTags = this.textFieldTags.filter((item) => item !== tag);
    }

    private handleTagKeydown(event: KeyboardEvent, source: 'inline' | 'text-field'): void {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            this.addTag(source);
            return;
        }

        if (event.key !== 'Backspace') {
            return;
        }

        const draft = source === 'inline' ? this.inlineTagDraft : this.textFieldTagDraft;

        if (draft) {
            return;
        }

        if (source === 'inline') {
            this.inlineTags = this.inlineTags.slice(0, -1);
        } else {
            this.textFieldTags = this.textFieldTags.slice(0, -1);
        }
    }

    private addTag(source: 'inline' | 'text-field'): void {
        const draft = source === 'inline' ? this.inlineTagDraft : this.textFieldTagDraft;
        const value = draft.trim();

        if (source === 'inline') {
            this.inlineTagDraft = '';

            if (value && !this.inlineTags.includes(value)) {
                this.inlineTags = [...this.inlineTags, value];
            }

            return;
        }

        this.textFieldTagDraft = '';

        if (value && !this.textFieldTags.includes(value)) {
            this.textFieldTags = [...this.textFieldTags, value];
        }
    }

    private getInputValue(event: Event): string {
        return event.target instanceof HTMLInputElement ? event.target.value : '';
    }
}
