import { AfterViewInit, Component, effect, ElementRef, HostListener, Input, signal } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { ButtonSize } from '../../../types/button-size.type';
import { IconButtonType } from '../../../types/icon-button-type.type';
import { IconButtonWidth } from '../../../types/icon-button-width.type';

@Component({
    selector: 'button[md3-icon-button]',
    imports: [],
    templateUrl: './icon-button.html',
    styleUrl: './icon-button.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class IconButton {
    @Input('button-size') set size(value: ButtonSize) {
        this.element.classList.remove('md3-' + this.buttonSize());
        this.buttonSize.set(value);
    };
    @Input('button-type') set type(value: IconButtonType) {
        this.element.classList.remove('md3-' + this.buttonType());
        this.buttonType.set(value);
    };
    @Input('button-width') set width(value: IconButtonWidth) {
        this.element.classList.remove('md3-' + this.buttonWidth());
        this.buttonWidth.set(value);
    };
    @Input('button-squared') set squared(value: boolean) {
        this.isSquared.set(value);
    };
    @Input('selected') set selected(value: boolean) {
        this.isSelected.set(value);
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
    private buttonType = signal<IconButtonType>('filled');
    private buttonWidth = signal<IconButtonWidth>('default');
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
            this.element.classList.add('md3-' + this.buttonWidth());
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
