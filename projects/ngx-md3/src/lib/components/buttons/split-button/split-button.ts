import { booleanAttribute, Component, contentChild, contentChildren, effect, ElementRef, input } from '@angular/core';
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
    public buttonSize = input<ButtonSize>('small', {
        alias: 'button-size',
    });
    public buttonType = input<SplitButtonType>('filled', {
        alias: 'button-type',
    });

    public flipTrailingIcon = input<boolean, unknown>(true, {
        alias: 'flip-trailing-icon',
        transform: booleanAttribute,
    });

    private button = contentChild<Button>(Button);
    private iconButtons = contentChildren<IconButton>(IconButton);

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.buttonSize());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.buttonSize());
            });
        });

        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.buttonType());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.buttonType());
            });
        });
        
        effect(() => {
            const button = this.button();
            if (!button) {
                return;
            }
            
            const buttonSize = this.buttonSize();
            const buttonType = this.buttonType();
            
            button.buttonSize.set(buttonSize);
            button.buttonType.set(buttonType);
            button.isSquared.set(false);
            button.isSelected.set(null);
        });
        
        effect(() => {
            this.iconButtons().forEach((iconButton) => {
                const buttonSize = this.buttonSize();
                const buttonType = this.buttonType();
                
                iconButton.buttonSize.set(buttonSize);
                iconButton.buttonType.set(buttonType == 'elevated' ? 'standard' : buttonType);
                iconButton.buttonWidth.set('default');
                iconButton.isSquared.set(false);
                iconButton.isSelected.set(null);
                
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
