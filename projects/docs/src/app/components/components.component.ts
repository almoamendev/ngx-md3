import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card, IconButton, IconElement, InputElement, MaterialIcon, TextField, TypeBody, TypeTitle } from '@vip9008/ngx-md3';
import { COMPONENT_GROUPS, COMPONENTS, ComponentEntry, componentsInGroup, ungroupedComponents } from './components.catalog';

interface ComponentSection {
    label: string;
    entries: ComponentEntry[];
}

/**
 * Strips everything that isn't a letter or a number so searching ignores
 * spacing and punctuation: "navigationbar", "navigation bar" and
 * "navigation-bar" all normalize to the same thing.
 */
function normalize(value: string): string {
    return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

/**
 * Normalized text an entry can be matched against. Fields are normalized
 * individually and then joined with a separator that survives normalization,
 * so a query can't match across a field boundary.
 */
function searchableText(entry: ComponentEntry): string {
    return [entry.label, entry.description, entry.group ?? '']
        .map(normalize)
        .join('|');
}

@Component({
    selector: 'app-components',
    imports: [
        RouterLink,
        Card,
        MaterialIcon,
        IconElement,
        IconButton,
        TextField,
        InputElement,
        TypeTitle,
        TypeBody,
    ],
    templateUrl: './components.component.html',
    styleUrl: './components.component.scss',
})
export class ComponentsComponent {
    public readonly total: number = COMPONENTS.length;

    public readonly sections: ComponentSection[] = [
        ...COMPONENT_GROUPS.map((group) => ({
            label: group as string,
            entries: componentsInGroup(group),
        })),
        {
            label: 'Other components',
            entries: ungroupedComponents(),
        },
    ].filter((section) => section.entries.length > 0);

    private readonly haystacks: Map<string, string> = new Map(
        COMPONENTS.map((entry) => [entry.link, searchableText(entry)]),
    );

    public query = signal<string>('');

    /** The query reduced to letters and numbers. Empty means "show everything". */
    public readonly normalizedQuery = computed<string>(() => normalize(this.query()));

    public readonly isFiltering = computed<boolean>(() => this.normalizedQuery().length > 0);

    public readonly filteredSections = computed<ComponentSection[]>(() => {
        const query = this.normalizedQuery();

        if (!query) {
            return this.sections;
        }

        return this.sections
            .map((section) => ({
                label: section.label,
                entries: section.entries.filter((entry) => this.matches(entry, query)),
            }))
            .filter((section) => section.entries.length > 0);
    });

    public readonly matchCount = computed<number>(() => {
        return this.filteredSections().reduce((count, section) => count + section.entries.length, 0);
    });

    public onSearch(event: Event): void {
        this.query.set((event.target as HTMLInputElement).value);
    }

    public clearSearch(): void {
        this.query.set('');
    }

    /**
     * Matches against the group as well as the entry itself, so a search for
     * "selection" surfaces the checkboxes/switches/radio buttons that never
     * spell the word out in their own label or description.
     */
    private matches(entry: ComponentEntry, normalizedQuery: string): boolean {
        return this.haystacks.get(entry.link)?.includes(normalizedQuery) ?? false;
    }
}
