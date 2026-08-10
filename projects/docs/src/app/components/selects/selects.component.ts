import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
    Button,
    Divider,
    Select,
    SelectOption,
    SelectOptionGroup,
    TypeBody,
    TypeDisplay,
} from '@almoamendev/ngx-md3';
import { Playground } from '../playground/playground';
import { Shiki } from '../shiki/shiki';

interface City {
    id: string;
    name: string;
    country: string;
}

const CITIES: City[] = [
    { id: 'ny', name: 'New York', country: 'United States' },
    { id: 'bos', name: 'Boston', country: 'United States' },
    { id: 'aus', name: 'Austin', country: 'United States' },
    { id: 'lon', name: 'London', country: 'United Kingdom' },
    { id: 'man', name: 'Manchester', country: 'United Kingdom' },
    { id: 'par', name: 'Paris', country: 'France' },
    { id: 'lyo', name: 'Lyon', country: 'France' },
    { id: 'tok', name: 'Tokyo', country: 'Japan' },
    { id: 'osa', name: 'Osaka', country: 'Japan' },
];

@Component({
    selector: 'app-selects',
    imports: [
        Select,
        SelectOption,
        SelectOptionGroup,
        Button,
        Divider,
        Playground,
        ReactiveFormsModule,
        RouterLink,
        Shiki,
        TypeBody,
        TypeDisplay,
    ],
    templateUrl: './selects.component.html',
    styleUrl: './selects.component.scss',
})
export class SelectsComponent {
    public readonly cities = CITIES;
    public readonly countries = ['United States', 'United Kingdom', 'France', 'Japan'];

    public singleCity = signal<string | null>(null);
    public outlinedCity = signal<string | null>('par');
    public manyCities = signal<string[]>(['ny', 'bos']);
    public searchedCity = signal<string | null>(null);

    /** The reactive form example, which is what shows the error state. */
    public cityControl = new FormControl<string | null>(null, Validators.required);

    /** Object values, which is what compare-with is for. */
    public cityObject = signal<City | null>(null);
    public compareCities = (a: City, b: City): boolean => a?.id === b?.id;

    // Server-driven search
    public remoteCities = signal<City[]>(CITIES);
    public remoteLoading = signal<boolean>(false);
    public remoteCity = signal<string | null>(null);
    private remoteTimer?: ReturnType<typeof setTimeout>;

    public apiImport: string = `// Component imports
import {
    Select,
    SelectOption,
    SelectOptionGroup, // optional
} from '@almoamendev/ngx-md3';`;

    public apiData: string = `// Reactive forms bind to md3-select itself
<md3-select formControlName="city" label="City">…</md3-select>

// or two-way, with no form
<md3-select [(value)]="city" label="City">…</md3-select>

// reading and driving it from code
selectRef.isOpen();      // signal<boolean>
selectRef.open();
selectRef.close();
selectRef.toggle();

// object values need a comparator
compareCities = (a: City, b: City) => a?.id === b?.id;

// server-driven search
<md3-select searchable filter-mode="manual" [loading]="loading()"
            (searchChange)="search($event)">…</md3-select>`;

    public apiUsage: string = `<!-- single -->
<md3-select label="City" [(value)]="city">
    <md3-select-option value="ny">New York</md3-select-option>
    <md3-select-option value="bos">Boston</md3-select-option>
    <md3-select-option value="aus" disabled>Austin</md3-select-option>
</md3-select>

<!-- outlined, with a leading icon and supporting text -->
<md3-select
    label="City"
    field-type="outlined"
    leading-icon="place"
    supporting-text="Where you are based"
    [(value)]="city">
    <md3-select-option value="ny">New York</md3-select-option>
</md3-select>

<!-- multiple, clearable -->
<md3-select label="Cities" multiple clearable [(value)]="cities">
    <md3-select-option value="ny">New York</md3-select-option>
    <md3-select-option value="bos">Boston</md3-select-option>
</md3-select>

<!-- searchable, filtered here -->
<md3-select label="City" searchable [(value)]="city">
    <md3-select-option value="ny">New York</md3-select-option>
</md3-select>

<!-- grouped, with richer option content -->
<md3-select label="City" [(value)]="city">
    <md3-select-option-group label="Japan">
        <md3-select-option value="tok" supporting-text="Kanto">Tokyo</md3-select-option>
    </md3-select-option-group>
</md3-select>

<!-- object values -->
<md3-select label="City" [compare-with]="compareCities" [(value)]="city">
    <md3-select-option [value]="city" [label]="city.name">{{ city.name }}</md3-select-option>
</md3-select>`;

    public clearForm(): void {
        this.cityControl.reset();
    }

    public touchForm(): void {
        this.cityControl.markAsTouched();
    }

    public toggleFormDisabled(): void {
        if (this.cityControl.disabled) {
            this.cityControl.enable();

            return;
        }

        this.cityControl.disable();
    }

    /** Stands in for a request: filters the list after a short delay. */
    public searchRemote(query: string): void {
        clearTimeout(this.remoteTimer);
        this.remoteLoading.set(true);

        this.remoteTimer = setTimeout(() => {
            const term = query.trim().toLowerCase();

            this.remoteCities.set(term
                ? CITIES.filter((city) => city.name.toLowerCase().includes(term))
                : CITIES);
            this.remoteLoading.set(false);
        }, 400);
    }

    public citiesIn(country: string): City[] {
        return CITIES.filter((city) => city.country === country);
    }
}
