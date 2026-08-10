import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BOTTOM_SHEET_CONFIG } from './bottom-sheet-ref';
import { BottomSheetSurface } from './bottom-sheet-surface';
import {
    BottomSheetConfig,
    BottomSheetContainer,
    BottomSheetState,
} from '../../../interfaces/bottom-sheet-config.interface';

/**
 * Modal bottom sheet shell. Like Dialog, it extends the CDK dialog container so focus
 * trapping, focus restoration and the ARIA attributes are handled by the CDK, while the
 * surface it wraps owns the MD3 panel, the drag handle and the animation. A modal sheet is
 * always an overlay above the page; the standard variant docks into the scaffold instead and
 * uses the same surface from a different shell.
 */
@Component({
    selector: 'md3-bottom-sheet',
    imports: [
        CdkPortalOutlet,
        BottomSheetSurface,
    ],
    templateUrl: './bottom-sheet.html',
    styleUrl: './bottom-sheet.scss',
})
export class BottomSheet extends CdkDialogContainer implements BottomSheetContainer {
    // Static, because BottomSheetService wires this shell to the sheet's reference as soon as
    // the CDK has created it, which is before any change detection has run over the view.
    @ViewChild(BottomSheetSurface, { static: true })
    private readonly surface!: BottomSheetSurface;

    protected readonly config = inject<BottomSheetConfig>(BOTTOM_SHEET_CONFIG, { optional: true }) ?? {};

    public get surfaceElement(): HTMLElement | null {
        return this.surface.surfaceElement;
    }

    public get dismissed(): Observable<void> {
        return this.surface.dismissed;
    }

    public get dragProgress(): Observable<number> {
        return this.surface.dragProgress;
    }

    public get stateChanges(): Observable<BottomSheetState> {
        return this.surface.stateChanges;
    }

    public startEnterAnimation(): void {
        this.surface.startEnterAnimation();
    }

    public setActive(value: boolean): void {
        this.surface.setActive(value);
    }

    public recaptureFocus(): void {
        this._recaptureFocus();
    }

    public override ngOnDestroy(): void {
        this.surface.destroy();
        super.ngOnDestroy();
    }
}
