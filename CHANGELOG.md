# Changelog

## 0.11.0

### Secondary entry points

Each component family is now its own secondary entry point, the way Angular Material is published, so apps can lazy-load the library's components. Before this release the package was a single FESM file, and because bundlers split code by file, every component an app used anywhere ended up in its initial chunk.

- New entry points: `core`, `typography`, `icon`, `avatar`, `badge`, `divider`, `button`, `split-button`, `button-group`, `card`, `carousel`, `chips`, `checkbox`, `radio`, `switch`, `slider`, `list`, `progress`, `app-bar`, `toolbar`, `navigation`, `text-field`, `select`, `menu`, `dialog`, `side-sheet`, `bottom-sheet`, `snackbar`, `scaffold` and `grid`, for example `@almoamendev/ngx-md3/button`. The README lists what each one exports.
- The root import `@almoamendev/ngx-md3` is unchanged and still exports everything. It now re-exports the entry points, so bundlers split it as well.
- `@angular/cdk/drag-drop` is only imported by `@almoamendev/ngx-md3/list`.
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
