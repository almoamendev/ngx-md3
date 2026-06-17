import { AfterViewInit, booleanAttribute, Component, effect, ElementRef, input } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Component({
    selector: 'md3-card, button[md3-card], a[md3-card]',
    imports: [],
    templateUrl: './card.html',
    styleUrl: './card.scss',
    // host: {
    //     tabindex: '0',
    // },
    hostDirectives: [
        StateComponent
    ],
})
export class Card implements AfterViewInit {
    public cardType = input<'elevated' | 'filled' | 'outlined'>('elevated', {
        alias: 'card-type',
    });

    public isInteractive = input<boolean, unknown>(false, {
        alias: 'interactive',
        transform: booleanAttribute,
    });

    private isActionTag: boolean = false;

    constructor(
        private el: ElementRef,
        private state: StateComponent,
    ) {
        effect((onCleanup) => {
            const type = 'md3-' + this.cardType();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });

        effect(() => {
            if (this.isInteractive() || this.isActionTag) {
                this.element.classList.add('md3-interactive');
                this.state.setStateLayer(true);

                if (!this.isActionTag) {
                    this.element.setAttribute('tabindex', '0');
                }
            } else {
                this.element.classList.remove('md3-interactive');
                this.state.setStateLayer(false);
                this.element.removeAttribute('tabindex');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        const tagName = this.element.tagName.toLowerCase();
        this.isActionTag = tagName != 'md3-card';
    }
}
