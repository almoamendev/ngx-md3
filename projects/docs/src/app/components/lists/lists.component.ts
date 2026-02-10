import { Component } from '@angular/core';
import { ListModule } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-lists.component',
    imports: [
        ListModule,
    ],
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.scss',
})
export class ListsComponent {
}
