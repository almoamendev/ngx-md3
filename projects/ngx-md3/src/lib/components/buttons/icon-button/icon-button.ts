import { Component, effect, ElementRef, HostListener, model } from '@angular/core';
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
    @HostListener('click', ['$event']) onClick(event: PointerEvent): void {
        if (this.isSelected() === null) {
            return;
        }

        this.isSelected.update((value) => {
            return !value;
        });
    }

    public buttonSize = model<ButtonSize>('small', {
        alias: 'button-size',
    });
    public buttonType = model<IconButtonType>('filled', {
        alias: 'button-type',
    });
    public buttonWidth = model<IconButtonWidth>('default', {
        alias: 'button-width',
    });
    public isSquared = model<boolean>(false, {
        alias: 'button-squared',
    });
    public isSelected = model<boolean | null>(null, {
        alias: 'selected',
    });

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

        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.buttonWidth());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.buttonWidth());
            });
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

    public enableSelection() {
        this.isSelected.update((current) => {
            if (current !== null) {
                return current;
            }

            return false;
        });
    }
}
