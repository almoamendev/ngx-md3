import { Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-list',
    standalone: false,
    templateUrl: './list.html',
    styleUrl: './list.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class List {
    @Input() variant: 'expressive' | 'baseline' = 'expressive';
    @Input() type: 'standard' | 'segmented' = 'standard';

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.classList.add(
            'md3-' + this.variant,
            'md3-' + this.type,
        );
    }
}
