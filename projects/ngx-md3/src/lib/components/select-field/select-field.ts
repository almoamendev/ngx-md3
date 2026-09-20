import { Component, effect, ElementRef, signal, viewChild, ViewContainerRef } from '@angular/core';
import { TextField } from '../text-field/text-field';
import { IconElement } from '../common/icon-element';
import { IconButton } from '../buttons/icon-button/icon-button';
import { InputElement } from '../common/input-element';
import { MaterialIcon } from '../common/material-icon/material-icon';
import { MenuService } from '../menu/menu.service';
import { SelectOptions } from './select-options/select-options';
import { MenuRef } from '../menu/menu-ref';

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
    private isMenuOpen = signal<boolean>(false);
    private menuRef: MenuRef<SelectOptions, unknown> | null = null;
    private inputElement = viewChild(InputElement, { read: ElementRef });
    
    constructor(
        private menuService: MenuService,
        private viewContainerRef: ViewContainerRef,
    ) {
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
            },
            bindDataToInputs: true,
            menuColors: 'standard',
            origin: this.inputElement(),
            xPosition: 'start',
            yPosition: 'below',
            overlapTrigger: false,
            // scrollStrategy: 'close',
            viewContainerRef: this.viewContainerRef,
        });

        this.menuRef.afterClosed().subscribe(() => this.isMenuOpen.set(false));
    }

    public openMenu() {
        this.isMenuOpen.set(true);
    }

    public toggleMenu() {
        this.isMenuOpen.update(current => !current);
    }
}