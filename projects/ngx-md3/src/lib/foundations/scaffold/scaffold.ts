import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, Component, inject, OnDestroy, viewChild } from '@angular/core';
import { SheetsService } from '../../components/sheets/sheets.service';

@Component({
    standalone: false,
    selector: 'md3-scaffold',
    templateUrl: './scaffold.html',
    styleUrl: './scaffold.scss',
})
export class Scaffold implements AfterViewInit, OnDestroy {
    private startOutlet = viewChild('startOutlet', { read: CdkPortalOutlet });
    private endOutlet = viewChild('endOutlet', { read: CdkPortalOutlet });
    private sheets = inject(SheetsService);

    ngAfterViewInit(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();

        if (startOutlet) {
            this.sheets.registerSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.registerSideSheetOutlet('end', endOutlet);
        }
    }

    ngOnDestroy(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();

        if (startOutlet) {
            this.sheets.unregisterSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.unregisterSideSheetOutlet('end', endOutlet);
        }
    }
}
