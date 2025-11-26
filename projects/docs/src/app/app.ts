import { Component, signal } from '@angular/core';
import { CircularProgressIndicator, LinearProgressIndicator, LoadingIndicator } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-root',
    imports: [
        LoadingIndicator,
        LinearProgressIndicator,
        CircularProgressIndicator,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('docs');
}
