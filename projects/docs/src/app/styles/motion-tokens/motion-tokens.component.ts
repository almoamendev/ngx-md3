import { Component } from '@angular/core';
import { TokenTable } from '../token-table/token-table';
import { Shiki } from '../../components/shiki/shiki';
import { countTokens, MOTION_TOKENS } from '../tokens.catalog';

@Component({
    selector: 'app-motion-tokens',
    imports: [
        TokenTable,
        Shiki,
    ],
    templateUrl: './motion-tokens.component.html',
    styleUrl: './motion-tokens.component.scss',
})
export class MotionTokensComponent {
    public readonly tokens = MOTION_TOKENS;
    public readonly total = countTokens(MOTION_TOKENS);

    public usageCode: string = `// something that moves or resizes — spatial
.my-panel {
    transition: transform
        var(--md-motion-expressive-default-spatial-duration)
        var(--md-motion-expressive-default-spatial-easing);
}

// something that fades or changes color — effects
.my-overlay {
    transition: opacity
        var(--md-motion-standard-fast-effects-duration)
        var(--md-motion-standard-fast-effects-easing);
}`;

    public namingCode: string = `--md-motion-<set>-<speed>-<kind>-<property>

// set:      expressive | standard
// speed:    fast | default | slow
// kind:     spatial | effects
// property: duration | easing`;
}
