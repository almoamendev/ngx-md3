import { booleanAttribute, Component, contentChildren, ElementRef, Input, signal } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { IconElement } from '../../common/icon-element';
import { InputElement } from '../../common/input-element';

@Component({
    selector: 'button[md3-menu-item], a[md3-menu-item]',
    imports: [
        InputElement,
        StateComponent,
    ],
    templateUrl: './menu-item.html',
    styleUrl: './menu-item.scss',
    host: {
        '(click)': 'onHostClick()',
    },
})
export class MenuItem {
    @Input('selected') set selected(value: boolean | null) {
        this.isSelected.update((current) => {
            if (value == current) {
                return current;
            }

            return value;
        });
    };

    public get selected(): boolean | null {
        return this.isSelected();
    }

    private isSelected = signal<boolean | null>(null);
    private iconElements = contentChildren(IconElement);
    
    public get leading(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType === 'leading');
    }

    public get trailing(): IconElement | undefined {
        return this.iconElements().find((icon) => icon.iconType === 'trailing');
    }

    public onHostClick(): void {
        const selected = this.isSelected();
        if (selected === null) {
            return;
        }

        this.isSelected.set(!selected);
    }

    constructor(private el: ElementRef<HTMLElement>) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
