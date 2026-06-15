import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';

@Component({
    selector: 'md3-side-sheet-body',
    imports: [],
    templateUrl: './side-sheet-body.html',
    styleUrl: './side-sheet-body.scss',
    host: {
        class: 'md3-scrollable',
    },
    hostDirectives: [
        CdkScrollable
    ],
})
export class SideSheetBody {
}
