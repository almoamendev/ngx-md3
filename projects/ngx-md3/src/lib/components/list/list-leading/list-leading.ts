import { Component, input } from '@angular/core';
import { ListLeadingType } from '../../../types/list-leading-type.type';
import { ListLeadingSize } from '../../../types/list-leading-size.type';

@Component({
    selector: 'md3-list-leading',
    templateUrl: './list-leading.html',
    styleUrl: './list-leading.scss',
})
export class ListLeading {
    public type = input<ListLeadingType>('icon');
    public size = input<ListLeadingSize>('image');
}
