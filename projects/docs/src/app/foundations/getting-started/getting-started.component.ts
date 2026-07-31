import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Divider, TypeBody } from '@vip9008/ngx-md3';
import { Shiki } from '../../components/shiki/shiki';

@Component({
    selector: 'app-getting-started',
    imports: [
        RouterLink,
        Shiki,
        TypeBody,
        Divider,
    ],
    templateUrl: './getting-started.component.html',
    styleUrl: './getting-started.component.scss',
})
export class GettingStartedComponent {
    public installCode: string = `npm install @vip9008/ngx-md3`;

    public peerDepsCode: string = `# peer dependencies — install if your app doesn't have them yet
npm install @angular/cdk`;

    public stylesConfigCode: string = `// angular.json
"styles": [
    "src/styles.scss"
]`;

    public stylesImportCode: string = `// src/styles.scss

// Brings in the tokens, the base reset, and the typography/icon fonts.
// Import this once, before your own global styles.
@use '@vip9008/ngx-md3/src/lib/styles/md3.scss';

// ...your own global styles`;

    public includePathsCode: string = `// angular.json — optional, shortens the import above
"stylePreprocessorOptions": {
    "includePaths": [
        "node_modules/@vip9008/ngx-md3/src/lib/styles"
    ]
}

// src/styles.scss
@use 'md3.scss';`;

    public firstComponentCode: string = `import { Component } from '@angular/core';
import { Button, MaterialIcon, IconElement } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-example',
    imports: [Button, MaterialIcon, IconElement],
    templateUrl: './example.component.html',
})
export class ExampleComponent {}`;

    public schemeMarkupCode: string = `<!-- light scheme (also the :root default) -->
<body class="md-scheme-light">...</body>

<!-- dark scheme -->
<body class="md-scheme-dark">...</body>`;

    public schemeServiceCode: string = `import { Component, inject } from '@angular/core';
import { LayoutService } from '@vip9008/ngx-md3';

@Component({ /* ... */ })
export class AppComponent {
    private layout = inject(LayoutService);

    public toggleTheme(): void {
        this.layout.darkMode.update((dark) => !dark);
    }
}`;

    public tokenUsageCode: string = `.my-banner {
    // tokens hold RGB channels, so they must be wrapped in rgb()
    background-color: rgb(var(--md-scheme-primary-container));
    color: rgb(var(--md-scheme-on-primary-container));

    // the same token, at 12% opacity
    border: 0.0625em solid rgb(var(--md-scheme-primary) / 0.12);

    border-radius: var(--md-border-radius-large);
    box-shadow: var(--md-shadow-3dp);

    transition: background-color
        var(--md-motion-standard-default-effects-duration)
        var(--md-motion-standard-default-effects-easing);
}`;

    public overrideCode: string = `// src/styles.scss
@use '@vip9008/ngx-md3/src/lib/styles/md3.scss';

// Override AFTER the import. Same selectors as md-scheme.scss, so these win
// on source order. Values are "R, G, B" channels — no rgb(), no hex.
:root, .md-scheme-light {
    --md-scheme-primary: 0, 105, 92;
    --md-scheme-on-primary: 255, 255, 255;
    --md-scheme-primary-container: 156, 242, 226;
    --md-scheme-on-primary-container: 0, 32, 27;
}

// Dark values are a separate block — overriding only :root leaves dark mode
// on the library defaults.
.md-scheme-dark {
    --md-scheme-primary: 128, 216, 200;
    --md-scheme-on-primary: 0, 55, 48;
    --md-scheme-primary-container: 0, 80, 70;
    --md-scheme-on-primary-container: 156, 242, 226;
}`;

    public overrideScopedCode: string = `<!-- tokens are inherited, so an override can be scoped to a subtree -->
<section class="brand-section">
    <button md3-button button-type="filled">Uses the branded primary</button>
</section>`;

    public overrideScopedStyleCode: string = `.brand-section {
    --md-scheme-primary: 122, 85, 102;
    --md-scheme-on-primary: 255, 255, 255;
}`;
}
