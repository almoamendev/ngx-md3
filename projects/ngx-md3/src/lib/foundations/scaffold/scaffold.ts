import { Component, Inject } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
    selector: 'md3-scaffold',
    imports: [],
    templateUrl: './scaffold.html',
    styleUrl: './scaffold.scss',
})
export class Scaffold {
    private layoutService = Inject(LayoutService);
}
