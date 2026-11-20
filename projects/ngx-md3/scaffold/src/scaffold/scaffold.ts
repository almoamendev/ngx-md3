import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, Component, effect, ElementRef, inject, OnDestroy, viewChild } from '@angular/core';
import { DIALOG_CONTEXT, SheetOutletRegistry, LayoutService, SheetOutletOptions } from '@almoamendev/ngx-md3/core';

@Component({
    selector: 'md3-scaffold',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './scaffold.html',
    styleUrl: './scaffold.scss',
})
export class Scaffold implements AfterViewInit, OnDestroy {
    private startOutlet = viewChild('startOutlet', { read: CdkPortalOutlet });
    private endOutlet = viewChild('endOutlet', { read: CdkPortalOutlet });
    private bottomOutlet = viewChild('bottomOutlet', { read: CdkPortalOutlet });
    private panesContainer = viewChild<ElementRef<HTMLElement>>('panesContainer');
    private sheetOutlets = inject(SheetOutletRegistry);
    private layout = inject(LayoutService);
    private el = inject(ElementRef);
    /** Set when the scaffold is in dialog content. A hidden dialog cannot host new sheets. */
    private dialogRef = inject(DIALOG_CONTEXT, { optional: true });
    private readonly isOutletAvailable = (): boolean => !this.dialogRef?.isHidden;

    /** A scaffold in dialog content registers as the dialog's, so `host: 'page'` skips it. */
    private get outletOptions(): SheetOutletOptions {
        return {
            isAvailable: this.isOutletAvailable,
            level: this.dialogRef ? 'dialog' : 'page',
        };
    }

    constructor() {
        // Publish what a floating bar covers but does not reserve. The main pane pads itself
        // by these values, and the fallback is 0, so a layout without a floating bar is
        // unchanged. A page that needs full-bleed content sets them back to 0 on itself.
        effect(() => {
            const inset = this.layout.floatingInset();
            const host = this.el.nativeElement as HTMLElement;

            host.style.setProperty('--md-scaffold-floating-inset-block-start', `${inset.blockStart}px`);
            host.style.setProperty('--md-scaffold-floating-inset-block-end', `${inset.blockEnd}px`);
        });
    }

    ngAfterViewInit(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();
        const bottomOutlet = this.bottomOutlet();
        const panesContainer = this.panesContainer();

        if (startOutlet) {
            this.sheetOutlets.register('start', startOutlet, this.outletOptions);
        }

        if (endOutlet) {
            this.sheetOutlets.register('end', endOutlet, this.outletOptions);
        }

        if (bottomOutlet) {
            this.sheetOutlets.register('bottom', bottomOutlet, this.outletOptions);
        }

        if (panesContainer) {
            this.layout.registerPanesContainer(panesContainer.nativeElement);
        }
    }

    ngOnDestroy(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();
        const bottomOutlet = this.bottomOutlet();

        if (startOutlet) {
            this.sheetOutlets.unregister('start', startOutlet);
        }

        if (endOutlet) {
            this.sheetOutlets.unregister('end', endOutlet);
        }

        if (bottomOutlet) {
            this.sheetOutlets.unregister('bottom', bottomOutlet);
        }

        this.layout.unregisterPanesContainer();
    }
}
