import { Component } from '@angular/core';
import { ButtonGroupModule } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-button-groups',
    imports: [
        ButtonGroupModule,
    ],
    templateUrl: './button-groups.component.html',
    styleUrl: './button-groups.component.scss',
})
export class ButtonGroupsComponent {
}
