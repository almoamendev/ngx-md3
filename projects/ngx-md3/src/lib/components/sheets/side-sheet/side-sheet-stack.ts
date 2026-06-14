import { Component, ComponentRef, Injector, inputBinding, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { SideSheet } from './side-sheet';

export interface SideSheetStackItem<T> {
    sheetComponentRef: ComponentRef<SideSheet>;
    contentComponentRef: ComponentRef<T>;
}

@Component({
    selector: 'md3-side-sheet-stack',
    template: '<ng-container #container></ng-container>',
    styles: [`
        :host {
            display: grid;
            min-inline-size: 0;
            min-block-size: 0;
            block-size: 100%;
        }

        :host ::ng-deep md3-side-sheet {
            grid-area: 1 / 1;
        }
    `],
})
export class SideSheetStack {
    @ViewChild('container', { read: ViewContainerRef, static: true })
    private readonly container!: ViewContainerRef;

    public createSheet<T>(component: Type<T>, injector: Injector): SideSheetStackItem<T> {
        const sheetComponentRef = this.container.createComponent(SideSheet, {
            injector: injector,
        });

        sheetComponentRef.changeDetectorRef.detectChanges();

        const contentComponentRef = sheetComponentRef.instance.attachContent(component, injector);

        sheetComponentRef.changeDetectorRef.detectChanges();

        return {
            sheetComponentRef,
            contentComponentRef,
        };
    }
}
