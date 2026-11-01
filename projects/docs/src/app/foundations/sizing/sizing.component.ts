import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService, TypeDisplay } from '@almoamendev/ngx-md3';
import { Shiki } from '../../components/shiki/shiki';

@Component({
    selector: 'app-sizing',
    imports: [
        RouterLink,
        Shiki,
        TypeDisplay,
    ],
    templateUrl: './sizing.component.html',
    styleUrl: './sizing.component.scss',
})
export class SizingComponent {
    protected readonly layout = inject(LayoutService);

    public componentCode: string = `:host {
    font-size: calc(var(--md3-scale, 1) * 1rem);  /* 16px at scale 1 */
    height: 2.5em;        /* 40dp */
    padding-inline: 1em;  /* 16dp */
    gap: 0.5em;           /* 8dp */
}`;

    public scaleUiCode: string = `/* styles.scss, after md3.scss */
html {
    font-size: 18px;   /* the whole UI, breakpoints included, grows by 12.5% */
}

/* or respect the font size the user chose in their browser */
html {
    font-size: 100%;
}`;

    public scaleComponentCode: string = `/* every component in the app */
:root {
    --md3-scale: 0.875;
}

/* one class of components, or one region */
.cta-button,
.compact-toolbar {
    --md3-scale: 1.25;
}`;

    public scaleComponentHtml: string = `<!-- one component: a 50dp tall button -->
<button md3-button style="--md3-scale: 1.25">Get started</button>

<!-- a region: the card and everything in it -->
<md3-card [style.--md3-scale]="0.875">
    <button md3-button>Compact</button>
</md3-card>`;

    public overlayScaleCode: string = `this.dialog.open(SettingsDialog, { scale: 1.25 });
this.sheets.openSideSheet(FiltersSheet, { scale: 0.875 });
this.menu.open(ActionsMenu, { origin: trigger, scale: 'inherit' });`;

    public breakpointsCode: string = `// md-grid.scss
html {
    container: md-viewport / inline-size;
}

@container md-viewport (min-width: 37.5rem) and (max-width: 74.999rem) { body { ... } }

// viewport.service.ts — the same thresholds, in rem
['extra-large', 100], ['large', 75], ['expanded', 52.5], ['medium', 37.5], ['compact', 0]`;

    public scrollbarGutterCode: string = `/* only when the window itself scrolls instead of the scaffold panes */
html {
    scrollbar-gutter: stable;
}`;
}
