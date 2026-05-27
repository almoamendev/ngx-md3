import { Component, effect, ElementRef, Input, signal } from '@angular/core';
import { ButtonSize } from '../../../types/button-size.type';
import { SplitButtonType } from '../../../types/split-button-type.type';

@Component({
    selector: 'md3-split-button',
    imports: [
    ],
    templateUrl: './split-button.html',
    styleUrl: './split-button.scss',
})
export class SplitButton {
    @Input('button-size') set size(value: ButtonSize) {
        this.buttonSize.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };
    @Input('button-type') set type(value: SplitButtonType) {
        this.buttonType.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };

    private buttonSize = signal<ButtonSize>('small');
    private buttonType = signal<SplitButtonType>('filled');

    constructor(private el: ElementRef) {
        effect(() => {
            this.element.classList.add('md3-' + this.buttonSize());
        });

        effect(() => {
            this.element.classList.add('md3-' + this.buttonType());
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
