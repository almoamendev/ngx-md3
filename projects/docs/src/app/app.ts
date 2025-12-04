import { Component, signal } from '@angular/core';
import { Button, MaterialIcon, IconElement, FloatingActionButton } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-root',
    imports: [
        MaterialIcon,
        IconElement,
        Button,
        FloatingActionButton
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    protected readonly title = signal('docs');
}
