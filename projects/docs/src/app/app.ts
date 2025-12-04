import { Component, signal } from '@angular/core';
import { Button, MaterialIcon, IconElement, FloatingActionButton, Card } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-root',
    imports: [
        Card
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('docs');
}
