import { Component, signal } from '@angular/core';
import { IconButton, IconElement, MaterialIcon, TextFieldModule } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-root',
    imports: [
        TextFieldModule,
        MaterialIcon,
        IconButton,
        IconElement,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('docs');
}
