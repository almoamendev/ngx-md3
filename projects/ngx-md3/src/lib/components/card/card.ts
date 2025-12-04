import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-card',
    imports: [],
    templateUrl: './card.html',
    styleUrl: './card.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class Card implements AfterViewInit {
    @Input() cardType: 'elevated' | 'filled' | 'outlined' = 'elevated';

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.setAttribute('tabindex', '0');
        this.element.classList.add('md3-' + this.cardType);
    }
}
