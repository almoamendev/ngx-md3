import { booleanAttribute, Component, contentChild, contentChildren, effect, ElementRef, input, signal, Signal } from '@angular/core';
import { ButtonSize } from '../../../types/button-size.type';
import { SplitButtonType } from '../../../types/split-button-type.type';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';
import { IconButtonWidth } from '../../../types/icon-button-width.type';

@Component({
    selector: 'md3-split-button',
    imports: [
    ],
    templateUrl: './split-button.html',
    styleUrl: './split-button.scss',
    host: {
        'role': 'group',
    },
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: SplitButton,
        },
    ],
})
export class SplitButton implements ButtonContext {
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

    // context values
    buttonContextSize: Signal<ButtonSize> = this.buttonSize;
    buttonContextType: Signal<SplitButtonType> = this.buttonType;
    buttonContextWidth: Signal<IconButtonWidth> = signal('default');
    buttonContextSquared?: Signal<boolean> = signal(false);

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const size = 'md3-' + this.buttonSize();
            this.element.classList.add(size);

            onCleanup(() => {
                this.element.classList.remove(size);
            });
        });

        effect((onCleanup) => {
            const type = 'md3-' + this.buttonType();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });
        
        effect(() => {
            this.button()?.isSelected.set(null);
        });
        
        effect(() => {
            this.iconButtons().forEach((iconButton) => {
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
