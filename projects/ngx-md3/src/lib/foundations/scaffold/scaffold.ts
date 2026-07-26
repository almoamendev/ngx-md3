import { CdkPortalOutlet } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, viewChild } from '@angular/core';
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
    private panesContainer = viewChild<ElementRef<HTMLElement>>('panesContainer');
    private sheets = inject(SheetsService);
    private layout = inject(LayoutService);

    ngAfterViewInit(): void {
        const startOutlet = this.startOutlet();
        const endOutlet = this.endOutlet();
        const panesContainer = this.panesContainer();

        if (startOutlet) {
            this.sheets.registerSideSheetOutlet('start', startOutlet);
        }

        if (endOutlet) {
            this.sheets.registerSideSheetOutlet('end', endOutlet);
        }

        if (panesContainer) {
            this.layout.registerPanesContainer(panesContainer.nativeElement);
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

        this.layout.unregisterPanesContainer();
    }
}
