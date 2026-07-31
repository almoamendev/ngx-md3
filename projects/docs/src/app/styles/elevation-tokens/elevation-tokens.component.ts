import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenTable } from '../token-table/token-table';
import { Shiki } from '../../components/shiki/shiki';
import { countTokens, ELEVATION_TOKENS } from '../tokens.catalog';

@Component({
    selector: 'app-elevation-tokens',
    imports: [
        RouterLink,
        TokenTable,
        Shiki,
    ],
    templateUrl: './elevation-tokens.component.html',
    styleUrl: './elevation-tokens.component.scss',
})
export class ElevationTokensComponent {
    public readonly tokens = ELEVATION_TOKENS;
    public readonly total = countTokens(ELEVATION_TOKENS);

    public usageCode: string = `.my-raised-surface {
    box-shadow: var(--md-shadow-3dp);

    // 0dp is a real shadow at zero size, so this animates cleanly
    transition: box-shadow
        var(--md-motion-standard-default-effects-duration)
        var(--md-motion-standard-default-effects-easing);
}

.my-raised-surface:hover {
    box-shadow: var(--md-shadow-6dp);
}`;

    public compositionCode: string = `// each token is three stacked layers: key light, ambient, and penumbra
--md-shadow-1dp: rgba(var(--md-scheme-shadow), 0.2) 0 0.125em 0.0625em -0.0625em,
                 rgba(var(--md-scheme-shadow), 0.14) 0 0.0625em 0.0625em 0,
                 rgba(var(--md-scheme-shadow), 0.12) 0 0.0625em 0.1875em 0;`;
}
