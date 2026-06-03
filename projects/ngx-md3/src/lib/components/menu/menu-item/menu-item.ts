import { Component, contentChildren, ElementRef, input, model } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { IconElement } from '../../common/icon-element';
import { InputElement } from '../../common/input-element';
import { MaterialIcon } from '../../common/material-icon/material-icon';
import { TypeBody, TypeLabel, TypeTitle } from '../../../../public-api';

@Component({
    selector: 'button[md3-menu-item], a[md3-menu-item]',
    imports: [
        InputElement,
        StateComponent,
        MaterialIcon,
        TypeLabel,
        TypeBody,
        TypeTitle,
    ],
    templateUrl: './menu-item.html',
    styleUrl: './menu-item.scss',
    host: {
        '(click)': 'onHostClick()',
    },
})
export class MenuItem {
    public label = input<string>('', {
        alias: 'label',
    });

    public supportingText = input<string | null>(null, {
        alias: 'supporting-text',
    });

    public trailingText = input<string | null>(null, {
        alias: 'trailing-text',
    });

    public selected = model<boolean | null>(null, {
        alias: 'selected'
    });

    private iconElements = contentChildren(IconElement);
    
    public get leading(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType() === 'leading');
    }

    public get trailing(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType() === 'trailing');
    }

    public get showLeadingIcon(): boolean {
        return (!!this.leading && !this.selected()) || this.selected() == true;
    }

    public onHostClick(): void {
        const selected = this.selected();
        if (selected === null) {
            return;
        }

        this.selected.set(!selected);
    }

    constructor(private el: ElementRef<HTMLElement>) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
