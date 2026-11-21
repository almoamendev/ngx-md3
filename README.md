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
import { Button } from '@almoamendev/ngx-md3/button';

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

## Entry points

Each component family is published as its own secondary entry point, the way Angular Material does it. Import from the entry point so each lazy route only carries the components it uses:

```ts
import { Button } from '@almoamendev/ngx-md3/button';
import { SnackbarService } from '@almoamendev/ngx-md3/snackbar';
```

The root import, `@almoamendev/ngx-md3`, still re-exports everything, and existing code keeps compiling. Each entry point is a separate file in the package, so bundlers split the root import too, but the entry points show more clearly what a file depends on.

| Entry point | Main exports |
| --- | --- |
| `@almoamendev/ngx-md3/core` | `LayoutService`, `ViewportService`, `StateComponent`, `InputElement`, `SheetHost`, `applyScale` |
| `@almoamendev/ngx-md3/typography` | `TypeDisplay`, `TypeHeadline`, `TypeTitle`, `TypeBody`, `TypeLabel` |
| `@almoamendev/ngx-md3/icon` | `MaterialIcon`, `IconElement` |
| `@almoamendev/ngx-md3/avatar` | `Avatar` |
| `@almoamendev/ngx-md3/badge` | `Badge` |
| `@almoamendev/ngx-md3/divider` | `Divider` |
| `@almoamendev/ngx-md3/button` | `Button`, `IconButton`, `FloatingActionButton` |
| `@almoamendev/ngx-md3/split-button` | `SplitButton` |
| `@almoamendev/ngx-md3/button-group` | `ButtonGroup` |
| `@almoamendev/ngx-md3/card` | `Card` |
| `@almoamendev/ngx-md3/carousel` | `Carousel`, `CarouselItem` |
| `@almoamendev/ngx-md3/chips` | `Chips`, `ChipAvatar` |
| `@almoamendev/ngx-md3/checkbox` | `Checkbox` |
| `@almoamendev/ngx-md3/radio` | `RadioButton` |
| `@almoamendev/ngx-md3/switch` | `Switch` |
| `@almoamendev/ngx-md3/slider` | `Slider` |
| `@almoamendev/ngx-md3/list` | `List`, `ListItem`, `ListLeading`, `ListSlot` |
| `@almoamendev/ngx-md3/list-reorder` | `LIST_REORDER` (`ListReorder`, `ListReorderItem`), for `draggable` lists |
| `@almoamendev/ngx-md3/progress` | `LoadingIndicator`, `LinearProgressIndicator`, `CircularProgressIndicator` |
| `@almoamendev/ngx-md3/app-bar` | `AppBar`, `AppBarHeader` |
| `@almoamendev/ngx-md3/toolbar` | `Toolbar`, `ToolbarItem` |
| `@almoamendev/ngx-md3/navigation` | `NavigationBar`, `NavigationRail`, `NavigationItem`, `NavigationGroup` |
| `@almoamendev/ngx-md3/text-field` | `TextField`, `SupportingText` |
| `@almoamendev/ngx-md3/select` | `SelectField` |
| `@almoamendev/ngx-md3/menu` | `Menu`, `MenuService`, `MenuItem`, `MenuGroup` |
| `@almoamendev/ngx-md3/dialog` | `DialogService`, `DialogRef`, `DialogHeader`, `DialogBody`, `DialogActions` |
| `@almoamendev/ngx-md3/side-sheet` | `SheetsService`, `SideSheetRef`, `SideSheetHeader`, `SideSheetBody`, `SideSheetActions` |
| `@almoamendev/ngx-md3/bottom-sheet` | `BottomSheetService`, `BottomSheetRef` |
| `@almoamendev/ngx-md3/snackbar` | `SnackbarService`, `SnackbarRef` |
| `@almoamendev/ngx-md3/scaffold` | `Layout`, `Scaffold`, `ScaffoldBar`, `ScaffoldRail`, `ScaffoldPane` |
| `@almoamendev/ngx-md3/grid` | `Grid`, `GridItem` |

Types and config interfaces come from the same entry point as the component that uses them, for example `ButtonSize` from `/button` and `DialogConfig` from `/dialog`.

The global styles stay where they were:

```scss
@use '@almoamendev/ngx-md3/src/lib/styles/md3.scss';
```

## Reorderable lists

Drag-and-drop reordering lives in its own entry point, so lists that are never reordered don't load `@angular/cdk/drag-drop`. Add `LIST_REORDER` to the imports of each component whose template has a `draggable` list; the markup stays the same.

```ts
import { List, ListItem } from '@almoamendev/ngx-md3/list';
import { LIST_REORDER } from '@almoamendev/ngx-md3/list-reorder';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  imports: [List, ListItem, LIST_REORDER],
  template: `
    <md3-list type="segmented" draggable (dropped)="drop($event)">
      @for (item of items; track item.id) {
        <md3-list-item [drag-disabled]="item.locked">…</md3-list-item>
      }
    </md3-list>
  `,
})
export class Tasks {
  drop(event: CdkDragDrop<unknown>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
```

Without `LIST_REORDER` a `draggable` list renders as a plain list, `(dropped)` never fires, and a warning is logged in dev mode. Reordering is meant for `md3-list-item` elements written directly inside `md3-list`; see the list docs for wrapping items in your own components.

## Dialogs

`DialogService.open()` opens a dialog and `openFullScreen()` opens one that covers the window. Both take a `DialogConfig` from `@almoamendev/ngx-md3/dialog`. Two options decide what can close a dialog without your code asking:

| Option | Default | |
| --- | --- | --- |
| `disableCloseEvents` | `false` | When `true`, clicking the scrim or pressing Escape doesn't close the dialog. |
| `closeOnNavigation` | `true` | When `false`, the dialog stays open when the user goes Back or Forward in the browser history (a `popstate`). Router navigation never closes dialogs on its own. |

A video player that should move to picture in picture on Back instead of closing:

```ts
const player = this.dialogs.openFullScreen(VideoPlayer, {
  disableCloseEvents: true,
  closeOnNavigation: false,
});

// Later, when the app moves the video to picture in picture:
player.hide();
```

A dialog hidden through `DialogRef.hide()` stays hidden until you call `show()` on it. The service never brings it back on its own: not when a dialog that was open over it closes, and not through `showAll()`. Only dialogs the service hid itself (with `previousDialog: 'hide'` or `hideAll()`) come back automatically.

## Repository layout

This is an Angular CLI workspace with two projects:

- `projects/ngx-md3` — the publishable component library ([`@almoamendev/ngx-md3`](https://www.npmjs.com/package/@almoamendev/ngx-md3) on npm). Each folder with an `ng-package.json` (`button/`, `dialog/`, …) is a secondary entry point with its own `public-api.ts`; `src/public-api.ts` re-exports them all, and `src/lib/styles` holds the global SCSS.
- `projects/docs` — the documentation site, deployed to GitHub Pages.

## Development

```bash
ng serve            # run the docs site locally at http://localhost:4200
ng build ngx-md3    # build the library (required before the docs app can resolve it)
ng build docs       # build the docs site
ng test ngx-md3     # run the library's unit tests
```

## License

MIT © Murtadha (Hussain) Almoamen — see [LICENSE](./LICENSE).
