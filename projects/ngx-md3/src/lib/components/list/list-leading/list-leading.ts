import { Component, input } from '@angular/core';

@Component({
    selector: 'md3-list-leading',
    standalone: false,
    templateUrl: './list-leading.html',
    styleUrl: './list-leading.scss',
})
export class ListLeading {
    public type = input<'icon' | 'avatar' | 'media' | 'selection-input'>('icon');
    public size = input<'image' | 'small-video' | 'large-video'>('image');
}
