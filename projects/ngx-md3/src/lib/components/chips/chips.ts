import { booleanAttribute, Component, ContentChild, contentChild, contentChildren, Directive, effect, ElementRef, input, Input, signal, viewChild } from '@angular/core';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { StateComponent } from '../common/state-component';
import { ChipType } from '../../types/chip-type.type';
import { AbstractControl, FormControlName } from '@angular/forms';
import { InputElement } from '../common/input-element';
import { IconElement } from '../common/icon-element';

@Directive({
    selector: '[md3-chip-avatar]'
})
export class ChipAvatar {}

@Component({
    selector: 'md3-chip, button[md3-chip], a[md3-chip], label[md3-chip]',
    imports: [
        StateComponent,
        MaterialIcon,
    ],
    templateUrl: './chips.html',
    styleUrl: './chips.scss',
})
export class Chips {
    @Input('chip-type') set type(value: ChipType) {
        this.chipType.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };

    @Input() control?: AbstractControl;
    @ContentChild(InputElement) input?: InputElement;
    @ContentChild(FormControlName) controlName?: FormControlName;

    private avatar = contentChild(ChipAvatar);
    private iconElements = contentChildren(IconElement);

    public get leading(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType === 'leading');
    }

    public get trailing(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType === 'trailing');
    }

    public isElevated = input<boolean, unknown>(false, {
        alias: 'elevated',
        transform: booleanAttribute,
    });

    private chipType = signal<ChipType>('assist');

    public get isSelectable(): boolean {
        return this.chipType() != 'assist';
    }

    public get showCheckIcon(): boolean {
        return !this.leading && this.chipType() == 'filter';
    }

    public get hasAvatar(): boolean {
        return this.avatar() != undefined && this.chipType() == 'input';
    }

    public get hasRemove(): boolean {
        return this.chipType() == 'input';
    }

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const type = this.chipType();
            this.element.classList.add('md3-' + type);

            if (type == 'input') {
                const stop = (event: Event) => {
                    event.stopPropagation();
                };

                this.trailing?.nativeElement.addEventListener('click', stop);
                this.trailing?.nativeElement.addEventListener('pointerdown', stop);

                onCleanup(() => {
                    this.trailing?.nativeElement.removeEventListener('click', stop);
                    this.trailing?.nativeElement.removeEventListener('pointerdown', stop);
                });
            }
        });

        effect(() => {
            if (this.isElevated()) {
                this.element.classList.add('md3-elevated');
            } else {
                this.element.classList.remove('md3-elevated');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}