import { Component, contentChildren, effect, ElementRef, HostListener, input, Signal } from '@angular/core';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';
import { ButtonSize } from '../../../types/button-size.type';
import { ButtonGroupSelection } from '../../../types/button-group-selection.type';
import { ButtonGroupType } from '../../../types/button-group-type.type';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';

@Component({
    selector: 'md3-button-group',
    standalone: false,
    templateUrl: './button-group.html',
    styleUrl: './button-group.scss',
    host: {
        'role': 'group',
    },
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: ButtonGroup,
        },
    ],
})
export class ButtonGroup implements ButtonContext {
    @HostListener('click', ['$event']) onClick(event: PointerEvent): void {
        if (this.groupSelection() !== 'single') {
            return;
        }

        const selectedItem = this.findEventButton(event);

        if (selectedItem?.isSelected()) {
            this.clearOtherSelections(selectedItem);
        }
    }
    
    public buttonSize = input<ButtonSize>('small', {
        alias: 'button-size',
    });
    public groupType = input<ButtonGroupType>('standard', {
        alias: 'group-type',
    });
    public groupSelection = input<ButtonGroupSelection>('none', {
        alias: 'selection',
    });

    private buttons = contentChildren<Button>(Button, { descendants: true });
    private iconButtons = contentChildren<IconButton>(IconButton, { descendants: true });
    
    // context values
    buttonContextSize: Signal<ButtonSize> = this.buttonSize;

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const size = this.buttonSize();
            this.element.classList.add('md3-' + size);

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.buttonSize());
            });
        });

        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.groupType());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.groupType());
            });
        });

        effect(() => {
            const selection = this.groupSelection();

            if (selection == 'none') {
                this.allButtons().forEach((item) => {
                    item.isSelected.set(null);
                });
            } else {
                this.allButtons().forEach((item) => {
                    item.enableSelection();
                });

                if (selection == 'single') {
                    this.normalizeSingleSelection();
                }
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    private findEventButton(event: PointerEvent): Button | IconButton | undefined {
        const target = event.target;

        if (!(target instanceof Node)) {
            return undefined;
        }

        return this.allButtons().find((item) => {
            return item.element.contains(target);
        });
    }

    private normalizeSingleSelection(): void {
        const selectedItem = this.allButtons().find((item) => {
            return item.isSelected();
        });

        if (selectedItem) {
            this.clearOtherSelections(selectedItem);
        }
    }

    private clearOtherSelections(selectedItem: Button | IconButton): void {
        this.allButtons().forEach((item) => {
            if (item != selectedItem) {
                item.isSelected.set(false);
            }
        });
    }

    private allButtons(): (Button | IconButton)[] {
        return [
            ...this.buttons(),
            ...this.iconButtons(),
        ];
    }
}
