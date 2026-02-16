import { Component, Input } from '@angular/core';

@Component({
    selector: 'md3-list-leading',
    standalone: false,
    templateUrl: './list-leading.html',
    styleUrl: './list-leading.scss',
})
export class ListLeading {
    @Input() type: 'icon' | 'avatar' | 'media' = 'icon';
    @Input() size: 'image' | 'small-video' | 'large-video' = 'image';
}
