import { Component, signal } from '@angular/core';
import { Card } from '@vip9008/ngx-md3';

@Component({
    selector: 'app-playground',
    imports: [
        Card,
    ],
    templateUrl: './playground.html',
    styleUrl: './playground.scss',
})
export class Playground {
    public title = signal<string>('Playground');
}
