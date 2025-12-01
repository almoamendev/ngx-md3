import { Component, signal } from '@angular/core';
import { MaterialIcon } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-root',
    imports: [
        MaterialIcon
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('docs');
}
