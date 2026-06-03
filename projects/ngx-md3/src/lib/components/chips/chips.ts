import { booleanAttribute, Component, computed, contentChild, contentChildren, Directive, effect, ElementRef, input, Input, output } from '@angular/core';
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
    public chipType = input<ChipType>('assist', {
        alias: 'chip-type',
    });

    public removeFunction = output<void>({
        alias: 'on-remove',
    });

    protected onRemoveClick(event: Event): void {
        event.stopPropagation();
        this.removeFunction.emit();
    }

    private avatar = contentChild(ChipAvatar);
    private iconElements = contentChildren(IconElement);

    public hasSurface = input<boolean, unknown>(false, {
        alias: 'surface',
        transform: booleanAttribute,
    });

    public isElevated = input<boolean, unknown>(false, {
        alias: 'elevated',
        transform: booleanAttribute,
    });

    public leading = computed(() => this.iconElements().find((icon) => icon.iconType === 'leading'));
    public trailing = computed(() => this.iconElements().find((icon) => icon.iconType === 'trailing'));
    public isSelectable = computed(() => this.chipType() != 'assist');
    public showCheckIcon = computed(() => !this.leading() && this.chipType() == 'filter');
    public hasAvatar = computed(() => this.avatar() != undefined && this.chipType() == 'input');
    public hasRemove = computed(() => this.chipType() == 'input');

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const type = this.chipType();
            this.element.classList.add('md3-' + type);

            onCleanup(() => {
                this.element.classList.remove('md3-' + type);
            });
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