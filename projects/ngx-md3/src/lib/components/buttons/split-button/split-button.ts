import { booleanAttribute, Component, contentChild, contentChildren, effect, ElementRef, input, Input, signal } from '@angular/core';
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

    public flipTrailingIcon = input<boolean, unknown>(true, {
        alias: 'flip-trailing-icon',
        transform: booleanAttribute,
    });

    private buttonSize = signal<ButtonSize>('small');
    private buttonType = signal<SplitButtonType>('filled');

    private button = contentChild<Button>(Button);
    private iconButtons = contentChildren<IconButton>(IconButton);

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
            this.iconButtons().forEach((iconButton) => {
                const buttonSize = this.buttonSize();
                const buttonType = this.buttonType();
                
                iconButton!.size = buttonSize;
                iconButton!.type = buttonType == 'elevated' ? 'standard' : buttonType;
                iconButton!.width = 'default';
                iconButton!.squared = false;
                iconButton!.selected = null;
                
                if (iconButton?.element.hasAttribute('md3-main-action')) {
                    return;
                }

                if (this.flipTrailingIcon()) {
                    iconButton?.element.classList.add('md3-flip-icon');
                } else {
                    iconButton?.element.classList.remove('md3-flip-icon');
                }
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
