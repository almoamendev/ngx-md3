import { Component } from '@angular/core';
import { IconButton, IconElement, MaterialIcon, TextFieldModule } from '@vip9008/ngx-md3';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-layout.component',
    imports: [
        TextFieldModule,
        MaterialIcon,
        IconButton,
        IconElement,
        RouterLink,
        RouterOutlet
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {

}
