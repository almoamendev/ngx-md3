import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { BOTTOM_SHEET_CONFIG } from './bottom-sheet-ref';
import { BottomSheetConfig, BottomSheetContainer } from '../../../interfaces/bottom-sheet-config.interface';

/**
 * Material 3 bottom sheet shell. Like Dialog, it extends the CDK dialog
 * container so focus trapping, focus restoration and the ARIA attributes are
 * handled by the CDK while this component only owns the MD3 surface, its
 * drag handle and the slide-up animation. There is no docked variant: a
 * bottom sheet is always a modal overlay.
 */
@Component({
    selector: 'md3-bottom-sheet',
    imports: [
        CdkPortalOutlet,
    ],
    templateUrl: './bottom-sheet.html',
    styleUrl: './bottom-sheet.scss',
    host: {
        '[class.md3-hide-handle]': '!showHandle()',
    },
})
export class BottomSheet extends CdkDialogContainer implements BottomSheetContainer {
    private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');

    protected readonly config = inject<BottomSheetConfig>(BOTTOM_SHEET_CONFIG, { optional: true }) ?? {};

    public isActive = signal<boolean>(false);
    public readonly showHandle = signal<boolean>(this.config.handle ?? true);

    public get surfaceElement(): HTMLElement | null {
        return this.surface()?.nativeElement ?? null;
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
