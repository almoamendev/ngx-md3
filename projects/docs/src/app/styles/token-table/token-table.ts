import { afterNextRender, Component, computed, inject, input } from '@angular/core';
import { TypeBody } from '@vip9008/ngx-md3';
import { TokenSection } from '../tokens.catalog';
import { TokenValuesService } from '../token-values.service';

export type TokenPreview = 'none' | 'color' | 'shadow' | 'radius' | 'motion';

interface ResolvedToken {
    name: string;
    description: string;
    tone?: string;
    value: string;
}

interface ResolvedSection {
    label: string;
    entries: ResolvedToken[];
}

@Component({
    selector: 'app-token-table',
    imports: [
        TypeBody,
    ],
    templateUrl: './token-table.html',
    styleUrl: './token-table.scss',
})
export class TokenTable {
    private readonly tokenValues = inject(TokenValuesService);

    public sections = input.required<TokenSection[]>();
    public preview = input<TokenPreview>('none');

    public readonly resolved = computed<ResolvedSection[]>(() => {
        // Re-read whenever the scheme or viewport changes.
        this.tokenValues.revision();

        return this.sections().map((section) => ({
            label: section.label,
            entries: section.entries.map((entry) => ({
                ...entry,
                value: this.tokenValues.read(entry.name),
            })),
        }));
    });

    constructor() {
        // Custom properties aren't resolvable until the component is in the
        // DOM, so take a reading once the first render settles.
        afterNextRender(() => this.tokenValues.refresh());
    }

    /** Color tokens hold RGB channels, so they need wrapping to be rendered. */
    public swatch(value: string): string {
        return value ? `rgb(${value})` : 'transparent';
    }
}
