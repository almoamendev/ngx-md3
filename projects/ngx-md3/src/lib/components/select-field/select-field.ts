import { booleanAttribute, Component, computed, contentChildren, effect, ElementRef, input, signal, viewChild, ViewContainerRef } from '@angular/core';
import { TextField } from '../text-field/text-field';
import { IconElement } from '../common/icon-element';
import { IconButton } from '../buttons/icon-button/icon-button';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { MenuService } from '../menu/menu.service';
import { SelectOptions } from './select-options/select-options';
import { MenuRef } from '../menu/menu-ref';
import { SelectOption } from '../../types/select-option.type';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'md3-select-field',
    imports: [
        TextField,
        IconElement,
        IconButton,
        InputElement,
        MaterialIcon,
    ],
    templateUrl: './select-field.html',
    styleUrl: './select-field.scss',
})
export class SelectField {
    public options = input.required<SelectOption[]>();
    public multiple = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });
    
    public menuColors = input<'standard' | 'vibrant'>('standard', {
        alias: 'menu-colors',
    });
    public fieldType = input<'filled' | 'outlined'>('filled', {
        alias: 'field-type',
    });
    public control = input<AbstractControl>(undefined, {
        alias: 'control',
    });
    
    private iconElements = contentChildren(IconElement, { descendants: true });
    public hasLeadingIcon = computed<boolean>(() => this.iconElements().some(i => i.iconType() === 'leading') ?? false);
    public hasArrowIcon = computed<boolean>(() => this.iconElements().some(i => i.iconType() === 'arrow') ?? false);

    private isMenuOpen = signal<boolean>(false);
    private menuRef: MenuRef<SelectOptions, unknown> | null = null;
    private inputElement = viewChild(InputElement, { read: ElementRef });

    private selectedOptions = signal<SelectOption[]>([]);

    public selectedText = computed<string | null>(() => {
        const selected = this.selectedOptions();
        if (selected.length == 0) {
            return null;
        }

        return selected[0].label + (selected.length > 1 ? ' +' + (selected.length -1) : '');
    });
    
    constructor(
        private menuService: MenuService,
        private viewContainerRef: ViewContainerRef,
    ) {
        effect(() => {
            let selected = this.options().filter((item) => item.selected);
            if (!this.multiple() && selected.length > 1) {
                selected = [selected[0]];
            }
            this.selectedOptions.set(selected);
        });

        effect(() => {
            if (this.isMenuOpen()) {
                this.openSelectOptions();
            } else {
                this.menuRef?.close();
                this.menuRef = null;
            }
        });
    }

    private openSelectOptions() {
        this.menuRef = this.menuService.open(SelectOptions, {
            data: {
                options: this.options(),
                multiple: this.multiple(),
            },
            bindDataToInputs: true,
            menuColors: this.menuColors(),
            origin: this.inputElement(),
            xPosition: 'start',
            yPosition: 'below',
            overlapTrigger: false,
            // scrollStrategy: 'close',
            viewContainerRef: this.viewContainerRef,
        });

        this.menuRef.componentInstance!.selectedOptions = this.selectedOptions;

        this.menuRef.afterClosed().subscribe(() => this.isMenuOpen.set(false));
    }

    public openMenu() {
        this.isMenuOpen.set(true);
    }

    public toggleMenu() {
        this.isMenuOpen.update(current => !current);
    }
}