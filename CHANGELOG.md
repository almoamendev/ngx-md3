# Changelog

## 0.14.0

### Styles: serve the fonts yourself with `md3-core.scss`

`md3.scss` loaded its fonts from Google Fonts with `@import` rules at its top, so an app that used it always called Google and showed no icons offline. The file is now split in two:

- `md3-fonts.scss`: the Google Fonts imports (Google Sans, Roboto, Noto Sans Arabic, the five Material Icons styles and the three Material Symbols styles).
- `md3-core.scss`: the tokens and base styles, without any font import.

`md3.scss` uses both and compiles to the same CSS as before, so apps that use it don't change. An app that ships its own font files uses `md3-core.scss` and declares the same font families with its own `@font-face` rules. See "Serving the fonts yourself" in the README.

## 0.13.0

### Dialogs: a dialog the app hid stays hidden

Closing a dialog could bring back a dialog the app had hidden on purpose. When a dialog closed, the service waited for the 160 ms handover and then called `show()` on the dialog underneath, without checking why that dialog was hidden. A full-screen video player that the app had moved to picture in picture with `hide()`, right after closing a dialog over it, came back over the next page.

The service now remembers who hid each dialog:

- A dialog hidden through `DialogRef.hide()` stays hidden until the app calls `show()` on it. This holds whenever `hide()` is called, during the handover delay too, and also for a dialog the service had already hidden behind another one.
- Closing a dialog brings back the dialog underneath only when it is on screen already or the service hid it, with `previousDialog: 'hide'`.
- The same rule applies to the full-screen dialog a restored dialog sits in, and to `showAll()`: it brings back what `hideAll()` or the service hid, and leaves dialogs hidden through `DialogRef.hide()` alone. Before, `showAll()` also showed those.

`previousDialog: 'hide'`, `hideAll()` and `showAll()` work as before for dialogs the app didn't hide itself. The public API doesn't change.

### Dialogs: `closeOnNavigation`

New `closeOnNavigation?: boolean` option on `DialogConfig`, for `open()` and `openFullScreen()`. It defaults to `true`, which is what every dialog did before: going Back or Forward in the browser history (a `popstate`) closes it. Set it to `false` to keep the dialog open, for example to move a video player to picture in picture on Back instead of closing it.

## 0.12.0

### List reordering moved to `@almoamendev/ngx-md3/list-reorder`

Drag-and-drop reordering is now opt-in, so a plain `md3-list` no longer loads `@angular/cdk/drag-drop`. Before this release every app that showed a list paid for the drag-drop code in the chunk that showed it, even when nothing was ever reordered.

- New entry point `@almoamendev/ngx-md3/list-reorder` with `LIST_REORDER`, an array of the two directives `ListReorder` (on `md3-list[draggable]`) and `ListReorderItem` (on list items). It also comes from the root import.
- `@almoamendev/ngx-md3/list` no longer imports `@angular/cdk/drag-drop`. `List` and `ListItem` no longer carry `CdkDropList` and `CdkDrag`.
- `draggable` on `md3-list` and `drag-disabled` on list items are still inputs of `List` and `ListItem`. The `dropped` output moved from `List` to `ListReorder`.
- The look and behaviour are the same: the preview inside the list, the dragged state layer, `drag-disabled` items, and items with a disabled selection input that can't be dragged.
- New `LIST_REORDER_STATE` token in `@almoamendev/ngx-md3/list`, which `ListReorder` provides so list items know whether they are draggable.

#### Migration (breaking for reorderable lists)

Add `LIST_REORDER` to the imports of every component whose template has a `draggable` list. The markup and your `(dropped)` handler don't change.

Before:

```ts
import { List, ListItem } from '@almoamendev/ngx-md3';

@Component({
  imports: [List, ListItem],
  template: `
    <md3-list type="segmented" draggable (dropped)="drop($event)">
      <md3-list-item [drag-disabled]="busy">…</md3-list-item>
    </md3-list>
  `,
})
```

After:

```ts
import { List, ListItem } from '@almoamendev/ngx-md3/list';
import { LIST_REORDER } from '@almoamendev/ngx-md3/list-reorder';

@Component({
  imports: [List, ListItem, LIST_REORDER],
  template: `
    <md3-list type="segmented" draggable (dropped)="drop($event)">
      <md3-list-item [drag-disabled]="busy">…</md3-list-item>
    </md3-list>
  `,
})
```

Without the import the list still compiles and renders, but its items can't be dragged and `(dropped)` never fires. In dev mode the list logs a warning that names the missing import. Code that read `List.dropped` directly, for example through `@ViewChild(List)`, has to use `ListReorder` instead.

Reordering is meant for `md3-list-item` elements written directly inside `md3-list`. If you wrap the item element itself in your own component, that component needs `LIST_REORDER` as well, and its styling is up to you; the list docs explain the details.

Measured in a test app with a plain two-item list on the start page and a reorderable list on a lazy route, with the same app code before and after:

| | 0.11.0 | 0.12.0 |
| --- | --- | --- |
| `@angular/cdk` in the initial chunks | 60.2 kB | 0 kB |
| ngx-md3 in the initial chunks | 12.5 kB | 12.2 kB |
| Initial total, raw | 370.5 kB | 308.9 kB |
| Initial total, estimated transfer | 87.6 kB | 73.8 kB |
| Reorder route's lazy chunk, raw | 0.8 kB | 63.5 kB |

## 0.11.0

### Secondary entry points

Each component family is now its own secondary entry point, the way Angular Material is published, so apps can lazy-load the library's components. Before this release the package was a single FESM file, and because bundlers split code by file, every component an app used anywhere ended up in its initial chunk.

- New entry points: `core`, `typography`, `icon`, `avatar`, `badge`, `divider`, `button`, `split-button`, `button-group`, `card`, `carousel`, `chips`, `checkbox`, `radio`, `switch`, `slider`, `list`, `progress`, `app-bar`, `toolbar`, `navigation`, `text-field`, `select`, `menu`, `dialog`, `side-sheet`, `bottom-sheet`, `snackbar`, `scaffold` and `grid`, for example `@almoamendev/ngx-md3/button`. The README lists what each one exports.
- The root import `@almoamendev/ngx-md3` is unchanged and still exports everything. It now re-exports the entry points, so bundlers split it as well.
- `@angular/cdk/drag-drop` is only imported by `@almoamendev/ngx-md3/list`.
  Since 0.12.0 it is only imported by `@almoamendev/ngx-md3/list-reorder`.
- The SCSS entry `@almoamendev/ngx-md3/src/lib/styles/md3.scss` stays at the same path.

Measured in a test app that imports `Button` and `SnackbarService` at startup and `Slider` only on a lazy route, with the same app code before and after:

| | 0.10.0 | 0.11.0 |
| --- | --- | --- |
| ngx-md3 in the initial chunks | 54.9 kB | 42.2 kB |
| `@angular/forms` in the initial chunks | 11.1 kB | 0 kB |
| ngx-md3 in the slider route's lazy chunk | 0 kB | 12.6 kB |
| Initial JS, total | 413.7 kB | 390.5 kB |

### Changes inside the library

- Scaffold no longer loads the sheet services or the dialog. Scaffolds and full screen dialogs register their sheet outlets with the new `SheetOutletRegistry`, and `SheetsService` and `BottomSheetService` pick them up when they are first created.
- A new `DIALOG_CONTEXT` token is provided in every dialog. Scaffold and AppBar use it to tell whether they are inside a dialog.
- Checkbox, RadioButton and Switch provide the new `LIST_ITEM_CONTROL` token, and ListItem uses it to find them, so a list no longer loads all three controls.
- `applyScale`, `readScale`, `ButtonContext`, `ViewportWidth` and `ViewportHeight` are now exported, because more than one entry point uses them.

No public API was removed or changed. `SheetsService.registerSideSheetOutlet()` and `BottomSheetService.registerBottomSheetOutlet()` still work when called directly.
