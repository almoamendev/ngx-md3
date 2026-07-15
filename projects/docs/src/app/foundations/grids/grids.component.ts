import { Component, inject } from '@angular/core';
import { Grid, GridItem, LayoutService, TypeBody } from '@vip9008/ngx-md3';
import { Playground } from '../../components/playground/playground';
import { Shiki } from '../../components/shiki/shiki';

@Component({
  selector: 'app-grids.component',
  imports: [
        Grid,
        GridItem,
        Playground,
        Shiki,
        TypeBody,
    ],
    templateUrl: './grids.component.html',
    styleUrl: './grids.component.scss',
})
export class GridsComponent {
    protected readonly layout = inject(LayoutService);

    public apiImport: string = `// Directive imports
import { Grid, GridItem } from '@vip9008/ngx-md3';`;

    public apiData: string = `// md3-grid
// no inputs — column count is derived from LayoutService.widthClass()
// compact: 4, medium/expanded: 8, large/extra-large: 12

// md3-grid-item
public colSpan = input(1, {
    alias: 'col-span',
    transform: numberAttribute,
});`;

    public apiUsage: string = `<!-- Directive usage -->

<div md3-grid>
    <div md3-grid-item col-span="2">...</div>
    <div md3-grid-item>...</div>
    <div md3-grid-item col-span="4">...</div>
</div>

<md3-grid>
    <md3-grid-item col-span="2">...</md3-grid-item>
    <md3-grid-item>...</md3-grid-item>
    <md3-grid-item col-span="4">...</md3-grid-item>
</>`;
}
