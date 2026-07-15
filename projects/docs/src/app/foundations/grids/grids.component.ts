import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Grid, GridItem, IconButton, IconElement, LayoutService, MaterialIcon, SheetsService, SideSheetRef, TypeBody, Divider, TypeHeadline } from '@vip9008/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';
import { GridConfig } from './grid-config/grid-config';

@Component({
  selector: 'app-grids.component',
  imports: [
        Grid,
        GridItem,
        IconButton,
        MaterialIcon,
        IconElement,
        Playground,
        Shiki,
        TypeBody,
        TypeHeadline,
        Divider
    ],
    templateUrl: './grids.component.html',
    styleUrl: './grids.component.scss',
})
export class GridsComponent implements OnDestroy {
    protected readonly layout = inject(LayoutService);

    private configSheet: SideSheetRef<GridConfig> | undefined;
    public configOpen = signal(false);

    private simulatedColumns = signal<string>('auto');

    protected readonly cols = computed<number | undefined>(() => {
        const value = this.simulatedColumns();
        return value === 'auto' ? undefined : Number(value);
    });

    protected readonly statusLabel = computed<string>(() => {
        const cols = this.cols();
        return cols ? `Simulated: ${cols} columns` : `Auto: ${this.layout.widthClass()} window`;
    });

    public apiImport: string = `// Directive imports
import { Grid, GridItem } from '@vip9008/ngx-md3';`;

    public apiData: string = `// md3-grid
public cols = input<number | undefined>(undefined, {
    alias: 'cols',
});
// falls back to LayoutService.widthClass() when omitted:
// compact: 4, medium/expanded: 8, large/extra-large: 12

// md3-grid-item
public colSpan = input(1, {
    alias: 'col-span',
    transform: numberAttribute,
});`;

    public apiUsage: string = `<!-- as its own element -->
<md3-grid>
    <md3-grid-item col-span="2">...</md3-grid-item>
    <md3-grid-item>...</md3-grid-item>
    <md3-grid-item col-span="4">...</md3-grid-item>
</md3-grid>

<!-- as an attribute, with the column count forced to 8 -->
<div md3-grid [cols]="8">
    <div md3-grid-item col-span="2">...</div>
    <div md3-grid-item>...</div>
    <div md3-grid-item col-span="4">...</div>
</div>`;

    constructor(
        private sheetsService: SheetsService,
    ) {
    }

    public openConfig(): void {
        if (this.configOpen()) {
            this.configSheet?.close();
            return;
        }

        this.configSheet = this.sheetsService.openSideSheet(GridConfig, {
            side: 'end',
            type: 'default',
            inset: true,
            closeExisting: true,
            bindDataToInputs: true,
        });
        this.configOpen.set(true);

        this.registerConfigEvents();

        this.configSheet.afterClosed().subscribe((_) => {
            this.configSheet = undefined;
            this.configOpen.set(false);
        });
    }

    ngOnDestroy(): void {
        this.configSheet?.close();
    }

    private registerConfigEvents() {
        this.configSheet?.componentInstance?.columns.setValue(this.simulatedColumns());
        this.configSheet?.componentInstance?.columns.registerOnChange(() => {
            this.simulatedColumns.set(this.configSheet?.componentInstance?.columns.value ?? 'auto');
        });
    }
}
