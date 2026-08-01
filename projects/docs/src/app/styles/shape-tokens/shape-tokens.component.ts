import { Component } from '@angular/core';
import { TypeDisplay } from '@almoamendev/ngx-md3';
import { TokenTable } from '../token-table/token-table';
import { Shiki } from '../../components/shiki/shiki';
import { countTokens, SHAPE_TOKENS } from '../tokens.catalog';

@Component({
    selector: 'app-shape-tokens',
    imports: [
        TokenTable,
        Shiki,
        TypeDisplay,
    ],
    templateUrl: './shape-tokens.component.html',
    styleUrl: './shape-tokens.component.scss',
})
export class ShapeTokensComponent {
    public readonly tokens = SHAPE_TOKENS;
    public readonly total = countTokens(SHAPE_TOKENS);

    public usageCode: string = `.my-card {
    border-radius: var(--md-border-radius-medium);
}

// pill and circle shapes
.my-chip {
    border-radius: var(--md-border-radius-rounded);
}

// corners can be mixed, e.g. a bottom sheet
.my-sheet {
    border-radius: var(--md-border-radius-large) var(--md-border-radius-large) 0 0;
}`;
}
