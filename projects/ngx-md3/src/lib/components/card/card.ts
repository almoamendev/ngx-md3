import { Component, effect, ElementRef, input } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-card',
    imports: [],
    templateUrl: './card.html',
    styleUrl: './card.scss',
    host: {
        tabindex: '0',
    },
    hostDirectives: [
        StateComponent
    ],
})
export class Card {
    public cardType = input<'elevated' | 'filled' | 'outlined'>('elevated', {
        alias: 'card-type',
    });

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.cardType());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.cardType());
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
