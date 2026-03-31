import { Component, ContentChild, ElementRef, Input } from '@angular/core';
import { PrimaryAction } from '../primary-action';

@Component({
    selector: 'md3-list-item',
    standalone: false,
    templateUrl: './list-item.html',
    styleUrl: './list-item.scss'
})
export class ListItem {
    @Input('slots-alignment') slotsAlignment: 'start' | 'center' | 'end' = 'center';
    @ContentChild(PrimaryAction) primaryAction?: PrimaryAction;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
