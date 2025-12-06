import { Component, signal } from '@angular/core';
import { TextField } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-root',
    imports: [
        TextField,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('docs');
}
