import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DIALOG_CONFIG } from '../dialog-ref';
import { DialogConfig, DialogContainer } from '../../../interfaces/dialog-config.interface';
import { SheetsService } from '../../sheets/sheets.service';

/**
 * Material 3 full screen dialog shell. It covers the viewport and lays its
 * content out like the scaffold does, with a main pane and a side sheet outlet
 * on each side, so side sheets opened while it is up land inside the dialog
 * instead of behind it.
 */
@Component({
    selector: 'md3-fullscreen-dialog',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './full-screen-dialog.html',
    styleUrl: './full-screen-dialog.scss',
})
export class FullScreenDialog extends CdkDialogContainer implements DialogContainer, AfterViewInit {
    private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
    private readonly startOutlet = viewChild('startOutlet', { read: CdkPortalOutlet });
    private readonly endOutlet = viewChild('endOutlet', { read: CdkPortalOutlet });
    private readonly sheets = inject(SheetsService);

    public isActive = signal<boolean>(false);

    protected readonly config = inject<DialogConfig>(DIALOG_CONFIG, { optional: true }) ?? {};

    public get surfaceElement(): HTMLElement | null {
        return this.surface()?.nativeElement ?? null;
    }

    ngAfterViewInit(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();

        // Taking the outlets over is what sends the next side sheet inside the
        // dialog. The scaffold gets them back when this dialog is destroyed.
        if (startOutlet) {
            this.sheets.registerSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.registerSideSheetOutlet('end', endOutlet);
        }
    }

    public override ngOnDestroy(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();

        if (startOutlet) {
            this.sheets.unregisterSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.unregisterSideSheetOutlet('end', endOutlet);
        }

        super.ngOnDestroy();
    }

    public startEnterAnimation(): void {
        requestAnimationFrame(() => {
            this.isActive.set(true);
        });
    }

    public setActive(value: boolean): void {
        this.isActive.set(value);
    }

    public recaptureFocus(): void {
        this._recaptureFocus();
    }
}
