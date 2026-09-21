import { Component, computed, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton, IconElement, MaterialIcon, SelectField, SelectOption, SheetsService, SideSheetRef, SupportingText, TypeBody, TypeDisplay } from '@almoamendev/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';
import { SelectFieldConfig } from './select-field-config/select-field-config';

@Component({
    selector: 'app-select-fields',
    imports: [
        SelectField,
        SupportingText,
        IconElement,
        IconButton,
        MaterialIcon,
        Playground,
        Shiki,
        TypeBody,
        TypeDisplay,
        RouterLink,
    ],
    templateUrl: './select-fields.component.html',
    styleUrl: './select-fields.component.scss',
})
export class SelectFieldsComponent implements OnDestroy {
    private configSheet: SideSheetRef<SelectFieldConfig> | undefined;
    public configOpen = signal(false);

    public fieldType = signal<'filled' | 'outlined'>('filled');
    public menuColors = signal<'standard' | 'vibrant'>('standard');
    public multiple = signal<boolean>(false);
    public leadingIcon = signal<boolean>(false);
    public supportingText = signal<boolean>(false);
    public disabled = signal<boolean>(false);
    public displayFormat = signal<'labels' | 'count' | 'summary'>('labels');
    public searchable = signal<boolean>(false);

    /**
     * The component writes the current selection back to SelectOption.selected. A fresh array
     * is used each time the selection mode changes, so the demo starts from a clean state.
     */
    public options = signal<SelectOption[]>(this.createOptions());

    /** Shows the first label and the number of the others: "AK (+2)". */
    public countFormat = (selected: SelectOption[]): string =>
        selected[0].label + (selected.length > 1 ? ` (+${selected.length - 1})` : '');

    /** Shows a count once more than one option is selected: "3 selected". */
    public summaryFormat = (selected: SelectOption[]): string =>
        selected.length == 1 ? selected[0].label : `${selected.length} selected`;

    public displayWith = computed<((selected: SelectOption[]) => string) | null>(() => {
        switch (this.displayFormat()) {
            case 'count':
                return this.countFormat;
            case 'summary':
                return this.summaryFormat;
            default:
                return null;
        }
    });

    public apiImport: string = `// Component imports
import {
    SelectField,
    SelectOption, // type
    SupportingText, // optional
    IconElement, // optional
    MaterialIcon, // optional
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// Types
type SelectOptionValue = string | number;

type SelectOption = {
    value: SelectOptionValue;
    label: string;
    supportingText?: string;
    trailingText?: string;
    selected?: boolean;
}

// The value reported to Angular forms
type SelectFieldValue = SelectOptionValue | SelectOptionValue[] | null;

// Inputs
public options = input.required<SelectOption[]>();
public multiple = input<boolean, unknown>(false, {
    transform: booleanAttribute,
});
public label = input<string | null>(null, {
    alias: 'label',
});
public displayWith = input<((selected: SelectOption[]) => string) | null>(null, {
    alias: 'display-with',
});
public searchable = input<boolean, unknown>(false, {
    transform: booleanAttribute,
});
public disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
});
public fieldType = input<'filled' | 'outlined'>('filled', {
    alias: 'field-type',
});
public menuColors = input<'standard' | 'vibrant'>('standard', {
    alias: 'menu-colors',
});
public control = input<AbstractControl | undefined>(undefined, {
    alias: 'control',
});`;

    public apiUsage: string = `<!-- Component usage -->

<!-- basic select field -->
<md3-select-field label="State" [options]="states"></md3-select-field>

<!-- outlined field with a leading icon and supporting text -->
<md3-select-field label="State" field-type="outlined" [options]="states">
    <md3-icon md3-icon-element="leading">flag</md3-icon>
    <div md3-supporting-text>Supporting text</div>
</md3-select-field>

<!-- multiple selection. the field shows the labels, joined: "AK, AZ, CA" -->
<md3-select-field label="States" multiple [options]="states"></md3-select-field>

<!-- displayed text: the first label and a count, "AK (+2)" -->
<md3-select-field label="States" multiple [options]="states"
    [display-with]="countFormat"></md3-select-field>

<!-- displayed text: a summary, "3 selected" -->
<md3-select-field label="States" multiple [options]="states"
    [display-with]="summaryFormat"></md3-select-field>

<!-- searchable field. the user can type in it to filter the options -->
<md3-select-field label="State" searchable [options]="states">
    <md3-icon md3-icon-element="leading">search</md3-icon>
</md3-select-field>

<!-- searchable and multiple -->
<md3-select-field label="States" searchable multiple [options]="states"></md3-select-field>

<!-- custom arrow icon -->
<md3-select-field label="State" [options]="states">
    <md3-icon md3-icon-element="arrow">expand_more</md3-icon>
</md3-select-field>

<!-- vibrant menu colors -->
<md3-select-field label="State" menu-colors="vibrant" [options]="states"></md3-select-field>

<!-- disabled field, outside of a form -->
<md3-select-field label="State" disabled [options]="states"></md3-select-field>

<!-- using a form control -->
<md3-select-field label="State" [options]="states" [formControl]="stateControl">
    <div md3-supporting-text>Select a state</div>
</md3-select-field>

<!-- using the control input -->
<md3-select-field label="State" [options]="states" [control]="stateControl"></md3-select-field>

<!-- using a form control name directive -->
<form [formGroup]="addressForm">
    <md3-select-field label="State" [options]="states" formControlName="state"></md3-select-field>
</form>`;

    public apiExample: string = `// Component code

public states: SelectOption[] = [
    { value: 'ak', label: 'AK', supportingText: 'Alaska' },
    { value: 'al', label: 'AL', supportingText: 'Alabama' },
    { value: 'az', label: 'AZ', supportingText: 'Arizona' },
];

// Shows the first label and the number of the others: "AK (+2)"
public countFormat = (selected: SelectOption[]): string =>
    selected[0].label + (selected.length > 1 ? \` (+\${selected.length - 1})\` : '');

// Shows a count once more than one option is selected: "3 selected"
public summaryFormat = (selected: SelectOption[]): string =>
    selected.length == 1 ? selected[0].label : \`\${selected.length} selected\`;

// single selection: 'ak' | 'al' | 'az' | null
public stateControl = new FormControl<string | null>('ak', Validators.required);

// multiple selection: an array of option values
public statesControl = new FormControl<string[]>(['ak', 'az']);

public addressForm = new FormGroup({
    state: this.stateControl,
});`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(SelectFieldConfig, {
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

        this.configSheet?.componentInstance?.menuColors.setValue(this.menuColors());
        this.configSheet?.componentInstance?.menuColors.registerOnChange(() => {
            this.menuColors.set(this.configSheet?.componentInstance?.menuColors.value);
        });

        this.configSheet?.componentInstance?.multiple.setValue(this.multiple());
        this.configSheet?.componentInstance?.multiple.registerOnChange(() => {
            this.multiple.set(this.configSheet?.componentInstance?.multiple.value);
            this.options.set(this.createOptions());
        });

        this.configSheet?.componentInstance?.displayFormat.setValue(this.displayFormat());
        this.configSheet?.componentInstance?.displayFormat.registerOnChange(() => {
            this.displayFormat.set(this.configSheet?.componentInstance?.displayFormat.value);
        });

        this.configSheet?.componentInstance?.searchable.setValue(this.searchable());
        this.configSheet?.componentInstance?.searchable.registerOnChange(() => {
            this.searchable.set(this.configSheet?.componentInstance?.searchable.value);
        });

        this.configSheet?.componentInstance?.leadingIcon.setValue(this.leadingIcon());
        this.configSheet?.componentInstance?.leadingIcon.registerOnChange(() => {
            this.leadingIcon.set(this.configSheet?.componentInstance?.leadingIcon.value);
        });

        this.configSheet?.componentInstance?.supportingText.setValue(this.supportingText());
        this.configSheet?.componentInstance?.supportingText.registerOnChange(() => {
            this.supportingText.set(this.configSheet?.componentInstance?.supportingText.value);
        });

        this.configSheet?.componentInstance?.disabled.setValue(this.disabled());
        this.configSheet?.componentInstance?.disabled.registerOnChange(() => {
            this.disabled.set(this.configSheet?.componentInstance?.disabled.value);
        });
    }

    private createOptions(): SelectOption[] {
        return [
            { value: 'ak', label: 'AK', supportingText: 'Alaska', selected: true },
            { value: 'al', label: 'AL', supportingText: 'Alabama' },
            { value: 'az', label: 'AZ', supportingText: 'Arizona' },
            { value: 'ca', label: 'CA', supportingText: 'California' },
            { value: 'co', label: 'CO', supportingText: 'Colorado' },
            { value: 'ct', label: 'CT', supportingText: 'Connecticut' },
        ];
    }
}
