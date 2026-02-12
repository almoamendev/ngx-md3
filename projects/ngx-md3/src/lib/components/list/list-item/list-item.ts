import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'md3-list-item',
    standalone: false,
    templateUrl: './list-item.html',
    styleUrl: './list-item.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class ListItem implements AfterViewInit {
    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.setAttribute('tabindex', '0');
    }
}
