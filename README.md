# ngx-md3

A standalone, signals-first Angular component library that follows the Material Design 3 spec closely — not a reskin of Material 2, and not a wrapper around Angular Material.

**Docs & live component gallery: https://almoamendev.github.io/ngx-md3/**

## Why ngx-md3

- **Material Design 3** — color, shape, elevation, and motion tokens taken straight from the MD3 spec.
- **Signals-first** — standalone components built on Angular Signals, with `model()` for real two-way bindings where they matter.
- **Accessible by default** — correct ARIA roles, states, and keyboard behavior are built into every component, not bolted on afterward.
- **Plays well with forms** — every input-like component works with Angular Reactive Forms out of the box.
- **Fully themeable** — swap the entire palette by overriding CSS custom properties, no rebuild required.
- **Tree-shakeable** — every component is a standalone import; pull in a button without dragging along the rest of the library.

## Quick start

```bash
npm install @almoamendev/ngx-md3
```

**View on NPM: https://www.npmjs.com/package/@almoamendev/ngx-md3/**

```ts
import { Component } from '@angular/core';
import { Button } from '@almoamendev/ngx-md3';

@Component({
    selector: 'app-example',
    imports: [Button],
    template: `
        <button md3-button button-type="filled">
            Get started
        </button>
    `,
})
export class ExampleComponent {}
```

Browse the full component catalogue, API references, and live playgrounds at **https://almoamendev.github.io/ngx-md3/**.

## Repository layout

This is an Angular CLI workspace with two projects:

- `projects/ngx-md3` — the publishable component library ([`@almoamendev/ngx-md3`](https://www.npmjs.com/package/@almoamendev/ngx-md3) on npm).
- `projects/docs` — the documentation site, deployed to GitHub Pages.

## Development

```bash
ng serve            # run the docs site locally at http://localhost:4200
ng build ngx-md3    # build the library (required before the docs app can resolve it)
ng build docs       # build the docs site
ng test ngx-md3     # run the library's unit tests
```

## License

MIT © Hussain Almomen — see [LICENSE](./LICENSE).
