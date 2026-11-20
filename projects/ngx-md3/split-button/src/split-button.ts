import { booleanAttribute, Component, contentChild, contentChildren, effect, ElementRef, input, signal, Signal } from '@angular/core';
import { ButtonSize, SplitButtonType, Button, IconButton, ButtonContext, MD3_BUTTON_CONTEXT, IconButtonWidth } from '@almoamendev/ngx-md3/button';

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

                iconButton.element.classList.toggle('md3-flip-icon', this.flipTrailingIcon());
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
