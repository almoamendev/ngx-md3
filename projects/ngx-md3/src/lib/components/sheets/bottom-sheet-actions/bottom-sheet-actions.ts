import { booleanAttribute, Component, input } from '@angular/core';

@Component({
    selector: 'md3-bottom-sheet-actions',
    imports: [],
    templateUrl: './bottom-sheet-actions.html',
    styleUrl: './bottom-sheet-actions.scss',
    host: {
        '[class.md3-style-divider]': 'showDivider()',
    },
})
export class BottomSheetActions {
    public showDivider = input<boolean, unknown>(false, {
        alias: 'show-divider',
        transform: booleanAttribute
    });
}
