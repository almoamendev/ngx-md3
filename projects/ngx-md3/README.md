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

## Install

```bash
npm install @almoamendev/ngx-md3
```

## Quick start

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

## Links

- Docs & component gallery: https://almoamendev.github.io/ngx-md3/
- Source & issues: https://github.com/almoamendev/ngx-md3

## License

MIT © Hussain Almomen — see [LICENSE](https://github.com/almoamendev/ngx-md3/blob/main/LICENSE).
