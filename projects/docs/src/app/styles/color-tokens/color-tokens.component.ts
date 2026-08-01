import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TypeDisplay } from '@almoamendev/ngx-md3';
import { TokenTable } from '../token-table/token-table';
import { Shiki } from '../../components/shiki/shiki';
import { COLOR_TOKENS, countTokens } from '../tokens.catalog';

@Component({
    selector: 'app-color-tokens',
    imports: [
        RouterLink,
        TokenTable,
        Shiki,
        TypeDisplay,
    ],
    templateUrl: './color-tokens.component.html',
    styleUrl: './color-tokens.component.scss',
})
export class ColorTokensComponent {
    public readonly tokens = COLOR_TOKENS;
    public readonly total = countTokens(COLOR_TOKENS);

    public usageCode: string = `.my-surface {
    // channels, so they must be wrapped
    background-color: rgb(var(--md-scheme-surface-container));
    color: rgb(var(--md-scheme-on-surface));

    // the same role at 12% opacity, no extra token needed
    outline: 0.0625em solid rgb(var(--md-scheme-primary) / 0.12);
}`;

    public overrideCode: string = `// after importing md3.scss
:root, .md-scheme-light {
    --md-scheme-primary: 0, 105, 92;
    --md-scheme-on-primary: 255, 255, 255;
}

.md-scheme-dark {
    --md-scheme-primary: 128, 216, 200;
    --md-scheme-on-primary: 0, 55, 48;
}`;
}
