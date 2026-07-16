import { Component, OnDestroy, signal } from '@angular/core';
import { IconButton, IconElement, InputElement, MaterialIcon, SheetsService, SideSheetRef, SupportingText, TextField, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { TextFieldConfig } from './text-field-config/text-field-config';

@Component({
    selector: 'app-text-fields',
    imports: [
        TextField,
        InputElement,
        SupportingText,
        IconElement,
        IconButton,
        MaterialIcon,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './text-fields.component.html',
    styleUrl: './text-fields.component.scss',
})
export class TextFieldsComponent implements OnDestroy {
    private configSheet: SideSheetRef<TextFieldConfig> | undefined;
    public configOpen = signal(false);

    public fieldType = signal<'filled' | 'outlined'>('filled');
    public leadingIcon = signal<boolean>(false);
    public trailingIcon = signal<'none' | 'icon' | 'button'>('none');
    public supportingText = signal<boolean>(false);
    public counter = signal<boolean>(false);
    public textarea = signal<boolean>(false);
    public disabled = signal<boolean>(false);
    public error = signal<boolean>(false);

    public apiImport: string = `// Component imports
import {
    TextField,
    InputElement,
    SupportingText, // optional
    IconElement, // optional
    IconButton, // optional
    MaterialIcon, // optional
} from '@vip9008/ngx-md3';`;

    public apiData: string = `// Inputs
public label = input<string | null>(null, {
    alias: 'label',
});
public fieldType = input<'filled' | 'outlined'>('filled', {
    alias: 'field-type',
});
public inputCounter = input<boolean | number>(false, {
    alias: 'input-counter',
});
public control = input<AbstractControl | undefined>(undefined, {
    alias: 'control',
});`;

    public apiUsage: string = `<!-- Component usage -->

<!-- basic input -->
<md3-text-field label="Text field">
    <input md3-input-element type="text">
    <div md3-supporting-text>Supporting text</div>
</md3-text-field>

<!-- outlined field with a leading icon -->
<md3-text-field label="Text field" field-type="outlined">
    <md3-icon md3-icon-element="leading">person</md3-icon>
    <input md3-input-element type="text">
</md3-text-field>

<!-- trailing icon -->
<md3-text-field label="Text field">
    <input md3-input-element type="text">
    <md3-icon md3-icon-element="trailing">visibility</md3-icon>
</md3-text-field>

<!-- trailing icon button -->
<md3-text-field label="Text field">
    <input md3-input-element type="text">
    <button md3-icon-button button-type="standard">
        <md3-icon md3-icon-element>close</md3-icon>
    </button>
</md3-text-field>

<!-- character counter -->
<md3-text-field label="Text field" [input-counter]="true">
    <input md3-input-element type="text">
</md3-text-field>

<!-- character counter with a limit -->
<md3-text-field label="Text field" [input-counter]="300">
    <input md3-input-element type="text">
</md3-text-field>

<!-- textarea -->
<md3-text-field label="Text field" [input-counter]="3000">
    <textarea md3-input-element></textarea>
</md3-text-field>

<!-- error state: set aria-invalid on the input, or let a bound form control report it -->
<md3-text-field label="Text field">
    <input md3-input-element type="text" aria-invalid="true">
    <div md3-supporting-text>Error message</div>
</md3-text-field>

<!-- using a form control -->
<md3-text-field label="Text field" [control]="textControl">
    <input md3-input-element type="text">
</md3-text-field>

<!-- using a form control name directive -->
<md3-text-field label="Text field">
    <input md3-input-element type="text" formControlName="textControlName">
</md3-text-field>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(TextFieldConfig, {
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });
        this.configOpen.set(true);

        this.registerConfigEvents();

        this.configSheet.afterClosed().subscribe((_) => {
            this.configSheet = undefined;
            this.configOpen.set(false);
        });
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
    }

    private registerConfigEvents() {
        this.configSheet?.componentInstance?.fieldType.setValue(this.fieldType());
        this.configSheet?.componentInstance?.fieldType.registerOnChange(() => {
            this.fieldType.set(this.configSheet?.componentInstance?.fieldType.value);
        });

        this.configSheet?.componentInstance?.leadingIcon.setValue(this.leadingIcon());
        this.configSheet?.componentInstance?.leadingIcon.registerOnChange(() => {
            this.leadingIcon.set(this.configSheet?.componentInstance?.leadingIcon.value);
        });

        this.configSheet?.componentInstance?.trailingIcon.setValue(this.trailingIcon());
        this.configSheet?.componentInstance?.trailingIcon.registerOnChange(() => {
            this.trailingIcon.set(this.configSheet?.componentInstance?.trailingIcon.value);
        });

        this.configSheet?.componentInstance?.supportingText.setValue(this.supportingText());
        this.configSheet?.componentInstance?.supportingText.registerOnChange(() => {
            this.supportingText.set(this.configSheet?.componentInstance?.supportingText.value);
        });

        this.configSheet?.componentInstance?.counter.setValue(this.counter());
        this.configSheet?.componentInstance?.counter.registerOnChange(() => {
            this.counter.set(this.configSheet?.componentInstance?.counter.value);
        });

        this.configSheet?.componentInstance?.textarea.setValue(this.textarea());
        this.configSheet?.componentInstance?.textarea.registerOnChange(() => {
            this.textarea.set(this.configSheet?.componentInstance?.textarea.value);
        });

        this.configSheet?.componentInstance?.disabled.setValue(this.disabled());
        this.configSheet?.componentInstance?.disabled.registerOnChange(() => {
            this.disabled.set(this.configSheet?.componentInstance?.disabled.value);
        });

        this.configSheet?.componentInstance?.error.setValue(this.error());
        this.configSheet?.componentInstance?.error.registerOnChange(() => {
            this.error.set(this.configSheet?.componentInstance?.error.value);
        });
    }
}
