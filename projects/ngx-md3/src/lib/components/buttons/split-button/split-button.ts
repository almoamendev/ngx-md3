import { Component, contentChild, effect, ElementRef, Input, signal } from '@angular/core';
import { ButtonSize } from '../../../types/button-size.type';
import { SplitButtonType } from '../../../types/split-button-type.type';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';

@Component({
    selector: 'md3-split-button',
    imports: [
    ],
    templateUrl: './split-button.html',
    styleUrl: './split-button.scss',
    host: {
        'role': 'group',
    },
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

    private button = contentChild<Button>(Button);
    private iconButton = contentChild<IconButton>(IconButton);

    constructor(private el: ElementRef) {
        effect(() => {
            this.element.classList.add('md3-' + this.buttonSize());
        });

        effect(() => {
            this.element.classList.add('md3-' + this.buttonType());
        });
        
        effect(() => {
            const button = this.button();
            if (!button) {
                return;
            }
            
            const buttonSize = this.buttonSize();
            const buttonType = this.buttonType();
            
            button!.size = buttonSize;
            button!.type = buttonType;
            button!.squared = false;
            button!.selected = null;
        });
        
        effect(() => {
            const iconButton = this.iconButton();
            if (!iconButton) {
                return;
            }
            
            const buttonSize = this.buttonSize();
            const buttonType = this.buttonType();
            
            iconButton!.size = buttonSize;
            iconButton!.type = buttonType == 'elevated' ? 'standard' : buttonType;
            iconButton!.width = 'default';
            iconButton!.squared = false;
            iconButton!.selected = null;
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
