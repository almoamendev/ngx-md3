import { Component, Inject } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
    standalone: false,
    selector: 'md3-scaffold',
    templateUrl: './scaffold.html',
    styleUrl: './scaffold.scss',
})
export class Scaffold {
    private layoutService = Inject(LayoutService);
}
