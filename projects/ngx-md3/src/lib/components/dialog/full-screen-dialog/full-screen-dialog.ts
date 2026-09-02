import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DIALOG_CONFIG } from '../dialog-ref';
import { DialogConfig, DialogContainer } from '../../../interfaces/dialog-config.interface';
import { SheetsService } from '../../sheets/sheets.service';

/**
 * Material 3 full screen dialog shell. It covers the viewport and holds the content.
 *
 * The content is an `md3-layout`. The layout places the regions — the bar rows for an app bar
 * or a toolbar, the rail columns, and the panes where side sheets open — so the dialog itself
 * places nothing but the content. A content root that is not a layout gets a warning in
 * development mode, and the shell falls back to panes of its own, so a side sheet never opens
 * behind the dialog where nobody can see it.
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
    private readonly mainPane = viewChild<ElementRef<HTMLElement>>('mainPane');
    private readonly startOutlet = viewChild('startOutlet', { read: CdkPortalOutlet });
    private readonly endOutlet = viewChild('endOutlet', { read: CdkPortalOutlet });
    private readonly sheets = inject(SheetsService);

    /** True while the shell holds the side sheet outlets, which happens without a layout only. */
    private ownsSideSheetOutlets = false;

    public isActive = signal<boolean>(false);

    protected readonly config = inject<DialogConfig>(DIALOG_CONFIG, { optional: true }) ?? {};

    public get surfaceElement(): HTMLElement | null {
        return this.surface()?.nativeElement ?? null;
    }

    ngAfterViewInit(): void {
        // The content is attached by now, so the layout it brings has already taken the
        // outlets. Its panes sit under the bar regions, which is where a side sheet belongs.
        const layout = this.findContentLayout();

        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            this.checkContentLayout(layout);
        }

        if (layout) {
            return;
        }

        // No layout, so the shell keeps the dialog self-sufficient. Without this the next side
        // sheet would open in the outlet underneath — the page scaffold, behind the dialog.
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();

        if (startOutlet) {
            this.sheets.registerSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.registerSideSheetOutlet('end', endOutlet);
        }

        this.ownsSideSheetOutlets = !!startOutlet || !!endOutlet;
    }

    public override ngOnDestroy(): void {
        if (this.ownsSideSheetOutlets) {
            const startOutlet = this.startOutlet();
            const endOutlet = this.endOutlet();

            if (startOutlet) {
                this.sheets.unregisterSideSheetOutlet('start', startOutlet);
            }

            if (endOutlet) {
                this.sheets.unregisterSideSheetOutlet('end', endOutlet);
            }

            this.ownsSideSheetOutlets = false;
        }

        super.ngOnDestroy();
    }

    /**
     * The layout at the root of the content, if the content brought one.
     *
     * The root is either the layout itself, or the component that holds it — a dialog is
     * normally opened with a component whose own template starts with `md3-layout`.
     */
    private findContentLayout(): HTMLElement | null {
        const content = this.mainPane()?.nativeElement.firstElementChild as HTMLElement | null;

        if (!content) {
            return null;
        }

        if (content.tagName === 'MD3-LAYOUT') {
            return content;
        }

        const root = content.firstElementChild as HTMLElement | null;

        return root?.tagName === 'MD3-LAYOUT' ? root : null;
    }

    private checkContentLayout(layout: HTMLElement | null): void {
        if (layout) {
            return;
        }

        console.warn(
            '[md3-fullscreen-dialog] the content of a full screen dialog should start with '
            + 'md3-layout. Without it the dialog has no bar and no rail region, so an app bar or '
            + 'a toolbar has nowhere to go, and the content does not scroll on its own.',
        );
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
