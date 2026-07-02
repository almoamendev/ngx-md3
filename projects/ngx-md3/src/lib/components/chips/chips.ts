import { booleanAttribute, Component, computed, contentChild, contentChildren, Directive, effect, ElementRef, input, Input, output } from '@angular/core';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { StateComponent } from '../common/state-component';
import { ChipType } from '../../types/chip-type.type';
import { IconElement } from '../common/icon-element';
import { ChipStyle } from '../../types/chip-style.type';

@Directive({
    selector: '[md3-chip-avatar]'
})
export class ChipAvatar {}

@Component({
    selector: 'button[md3-chip], a[md3-chip], label[md3-chip]',
    imports: [
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

    public chipStyle = input<ChipStyle>('default', {
        alias: 'chip-style',
    });

    public trailingFunction = output<void>({
        alias: 'on-trailing',
    });

    protected onTrailingClick(event: Event): void {
        event.stopPropagation();
        this.trailingFunction.emit();
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

    public leading = computed(() => this.iconElements().find((icon) => icon.iconType() === 'leading'));
    public trailing = computed(() => this.iconElements().find((icon) => icon.iconType() === 'trailing'));
    public isSelectable = computed(() => this.chipType() != 'assist');
    public showCheckIcon = computed(() => !this.leading() && this.chipType() == 'filter');
    public hasAvatar = computed(() => this.avatar() != undefined && this.chipType() == 'input');
    public hasRemove = computed(() => this.chipType() == 'input');

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const type = 'md3-' + this.chipType();
            this.element.classList.add(type);

            onCleanup(() => {
                this.element.classList.remove(type);
            });
        });

        effect((onCleanup) => {
            const style = 'md3-' + this.chipStyle();
            this.element.classList.add(style);

            onCleanup(() => {
                this.element.classList.remove(style);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}