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
            const type = 'md3-' + this.cardType();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
