import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService, TypeDisplay } from '@almoamendev/ngx-md3';
import { TokenTable } from '../token-table/token-table';
import { Shiki } from '../../components/shiki/shiki';
import { countTokens, GRID_TOKENS } from '../tokens.catalog';

@Component({
    selector: 'app-grid-tokens',
    imports: [
        RouterLink,
        TokenTable,
        Shiki,
        TypeDisplay,
    ],
    templateUrl: './grid-tokens.component.html',
    styleUrl: './grid-tokens.component.scss',
})
export class GridTokensComponent {
    protected readonly layout = inject(LayoutService);

    public readonly tokens = GRID_TOKENS;
    public readonly total = countTokens(GRID_TOKENS);

    public breakpointsCode: string = `html {
    container: md-viewport / inline-size;
}

// compact: <600dp
body {
    --md-grid-columns: 4;
    --md-grid-margin: 1em;
    --md-grid-gutter: 1em;
}

// medium, expanded: 600-1199dp
@container md-viewport (min-width: 37.5rem) and (max-width: 74.999rem) { body { ... } }

// large, extra-large: >=1200dp
@container md-viewport (min-width: 75rem) { body { ... } }`;

    public usageCode: string = `.my-layout {
    display: grid;
    grid-template-columns: repeat(var(--md-grid-columns), 1fr);
    gap: var(--md-grid-gutter);
    padding-inline: var(--md-grid-margin);
}`;
}
