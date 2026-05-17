import { Component, contentChildren, effect, ElementRef, Input, signal } from '@angular/core';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';
import { ButtonSize } from '../../../types/button-size.type';
import { ButtonGroupSelection } from '../../../types/button-group-selection.type';
import { ButtonGroupType } from '../../../types/button-group-type.type';

@Component({
    selector: 'md3-button-group',
    standalone: false,
    templateUrl: './button-group.html',
    styleUrl: './button-group.scss',
    host: {
        'role': 'group',
    }
})
export class ButtonGroup {
    @Input('button-size') set size(value: ButtonSize) {
        this.buttonSize.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };
    @Input('group-type') set type(value: ButtonGroupType) {
        this.groupType.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };

    @Input() set selection(value: ButtonGroupSelection) {
        this.groupSelection.set(value);
    };
    
    private buttonSize = signal<ButtonSize>('small');
    private groupType = signal<ButtonGroupType>('standard');
    private groupSelection = signal<ButtonGroupSelection>('none');

    private buttons = contentChildren<Button>(Button, { descendants: true });
    private iconButtons = contentChildren<IconButton>(IconButton, { descendants: true });

    constructor(private el: ElementRef) {
        effect(() => {
            const size = this.buttonSize();
            this.element.classList.add('md3-' + size);

            this.buttons().forEach((item) => {
                item.size = size;
            });

            this.iconButtons().forEach((item) => {
                item.size = size;
            });
        });

        effect(() => {
            this.element.classList.add('md3-' + this.groupType());
        });

        effect(() => {
            const selection = this.groupSelection();

            if (selection == 'none') {
                this.buttons().forEach((item) => {
                    item.selected = null;
                });

                this.iconButtons().forEach((item) => {
                    item.selected = null;
                });
            } else {
                this.buttons().forEach((item) => {
                    item.enableSelection();
                });

                this.iconButtons().forEach((item) => {
                    item.enableSelection();
                });
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
