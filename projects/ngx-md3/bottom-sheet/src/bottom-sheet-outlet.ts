import { Component, ComponentRef, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { StandardBottomSheet } from './standard-bottom-sheet';

/**
 * Host attached into the scaffold's sheet outlet, where standard bottom sheets are created.
 * It is attached as soon as the outlet registers and takes no space at any point: the sheets
 * it holds are positioned against the region around it, so a replacement can open while the
 * sheet it replaces is still animating out without either of them disturbing the layout.
 */
@Component({
    selector: 'md3-bottom-sheet-outlet',
    template: '<ng-container #container></ng-container>',
    styles: [`
        :host {
            display: block;
        }
    `],
})
export class BottomSheetOutlet {
    @ViewChild('container', { read: ViewContainerRef, static: true })
    private readonly container!: ViewContainerRef;

    public createSheet(injector: Injector): ComponentRef<StandardBottomSheet> {
        const sheetComponentRef = this.container.createComponent(StandardBottomSheet, { injector });

        // The shell's view has to exist before its portal outlet can take the content.
        sheetComponentRef.changeDetectorRef.detectChanges();

        return sheetComponentRef;
    }
}
