import { booleanAttribute, Component, input } from '@angular/core';

@Component({
    selector: 'md3-side-sheet-actions',
    imports: [],
    templateUrl: './side-sheet-actions.html',
    styleUrl: './side-sheet-actions.scss',
    host: {
        '[class.md3-style-divider]': 'showDivider()',
    },
})
export class SideSheetActions {
    public showDivider = input<boolean, unknown>(false, {
        alias: 'show-divider',
        transform: booleanAttribute
    });
}
