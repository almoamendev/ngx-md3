import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';

@Component({
    selector: 'md3-bottom-sheet-body',
    imports: [],
    templateUrl: './bottom-sheet-body.html',
    styleUrl: './bottom-sheet-body.scss',
    host: {
        class: 'md3-scrollable',
    },
    hostDirectives: [
        CdkScrollable
    ],
})
export class BottomSheetBody {
}
