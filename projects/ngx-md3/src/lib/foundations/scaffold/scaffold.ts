import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, viewChild } from '@angular/core';
import { BottomSheetService } from '../../components/sheets/bottom-sheet/bottom-sheet.service';
import { SheetsService } from '../../components/sheets/sheets.service';
import { LayoutService } from '../layout.service';

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
    private sheets = inject(SheetsService);
    private bottomSheets = inject(BottomSheetService);
    private layout = inject(LayoutService);

    ngAfterViewInit(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();
        const bottomOutlet = this.bottomOutlet();
        const panesContainer = this.panesContainer();

        if (startOutlet) {
            this.sheets.registerSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.registerSideSheetOutlet('end', endOutlet);
        }

        if (bottomOutlet) {
            this.bottomSheets.registerBottomSheetOutlet(bottomOutlet);
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
            this.sheets.unregisterSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.unregisterSideSheetOutlet('end', endOutlet);
        }

        if (bottomOutlet) {
            this.bottomSheets.unregisterBottomSheetOutlet(bottomOutlet);
        }

        this.layout.unregisterPanesContainer();
    }
}
