import { Component, effect, ElementRef, HostListener, Input, signal } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { ButtonSize } from '../../../types/button-size.type';
import { ButtonType } from '../../../types/button-type.type';

@Component({
    selector: 'button[md3-button]',
    imports: [],
    templateUrl: './button.html',
    styleUrl: './button.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class Button {
    @Input('button-size') set size(value: ButtonSize) {
        this.element.classList.remove('md3-' + this.buttonSize());
        this.buttonSize.set(value);
    };
    @Input('button-type') set type(value: ButtonType) {
        this.element.classList.remove('md3-' + this.buttonType());
        this.buttonType.set(value);
    };
    @Input('button-squared') set squared(value: boolean) {
        this.isSquared.set(value);
    };
    @Input('selected') set selected(value: boolean) {
        if (this.buttonType() == 'text') {
            this.isSelected.set(null);
        } else {
            this.isSelected.set(value);
        }
    };
    
    @HostListener('click', ['$event']) onClick(event: PointerEvent): void {
        if (this.isSelected() === null) {
            return;
        }

        this.isSelected.update((value) => {
            return !value;
        });
    }

    private buttonSize = signal<ButtonSize>('small');
    private buttonType = signal<ButtonType>('filled');
    private isSquared = signal<boolean>(false);
    private isSelected = signal<boolean | null>(null);

    constructor(private el: ElementRef) {
        effect(() => {
            this.element.classList.add('md3-' + this.buttonSize());
        });

        effect(() => {
            this.element.classList.add('md3-' + this.buttonType());
        });

        effect(() => {
            if (this.isSquared()) {
                this.element.classList.add('md3-square');
            } else {
                this.element.classList.remove('md3-square');
            }
        });

        effect(() => {
            const toggle = this.isSelected() !== null;

            if (toggle) {
                this.element.classList.add('md3-toggle');

                if (this.isSelected()) {
                    this.element.classList.add('md3-selected');
                } else {
                    this.element.classList.remove('md3-selected');
                }
            } else {
                this.element.classList.remove('md3-toggle', 'md3-selected');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
