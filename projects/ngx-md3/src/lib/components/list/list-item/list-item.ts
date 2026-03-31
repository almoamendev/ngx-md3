import { Component, ContentChild, ElementRef, Input, OnInit } from '@angular/core';
import { PrimaryAction } from '../primary-action';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'md3-list-item, label[md3-list-item], button[md3-list-item], a[md3-list-item]',
    standalone: false,
    templateUrl: './list-item.html',
    styleUrl: './list-item.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class ListItem implements OnInit {
    @Input('slots-alignment') slotsAlignment: 'start' | 'center' | 'end' = 'center';
    @ContentChild(PrimaryAction) primaryAction?: PrimaryAction;

    public isActionTag: boolean = false;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngOnInit(): void {
        let tagName = this.element.tagName.toLowerCase();

        if (tagName == 'label') {
            this.element.setAttribute('tabindex', '0');
        }

        this.isActionTag = tagName != 'md3-list-item';
        
        if (!this.isActionTag) {
            this.element.classList.remove('md3-state-component');
        }
    }
}
