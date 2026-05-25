import { booleanAttribute, Component, contentChild, contentChildren, Directive, effect, ElementRef, input, Input, output, signal } from '@angular/core';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { StateComponent } from '../common/state-component';
import { ChipType } from '../../types/chip-type.type';
import { IconElement } from '../common/icon-element';
import { NgTemplateOutlet } from '@angular/common';

@Directive({
    selector: '[md3-chip-avatar]'
})
export class ChipAvatar {}

@Component({
    selector: 'md3-chip, button[md3-chip], a[md3-chip], label[md3-chip]',
    imports: [
        NgTemplateOutlet,
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

    public removeFunction = output<void>({
        alias: 'on-remove',
    });

    protected onRemoveClick(event: Event): void {
        event.stopPropagation();
        this.removeFunction.emit();
    }

    private avatar = contentChild(ChipAvatar);
    private iconElements = contentChildren(IconElement);

    public get leading(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType === 'leading');
    }

    public get trailing(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType === 'trailing');
    }

    public hasSurface = input<boolean, unknown>(false, {
        alias: 'surface',
        transform: booleanAttribute,
    });

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
        });

        effect(() => {
            if (this.isElevated()) {
                this.element.classList.add('md3-elevated');
            } else {
                this.element.classList.remove('md3-elevated');
            }
        });

        effect(() => {
            if (this.hasSurface() && !this.isElevated()) {
                this.element.classList.add('md3-surface');
            } else {
                this.element.classList.remove('md3-surface');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}