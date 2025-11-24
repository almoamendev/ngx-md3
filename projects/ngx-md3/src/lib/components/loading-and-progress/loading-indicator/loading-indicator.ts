import { Component, Input } from '@angular/core';

@Component({
    selector: 'md3-loading-indicator',
    imports: [],
    templateUrl: './loading-indicator.html',
    styleUrl: './loading-indicator.scss',
})
export class LoadingIndicator {
    @Input() contained: boolean = false;
    @Input() size: number = 48;

    public get remSize(): number {
        return this.size / 16;
    }
}
