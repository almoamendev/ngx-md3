import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'md3-icon',
    imports: [],
    templateUrl: './material-icon.html',
    styleUrl: './material-icon.scss'
})
export class MaterialIcon implements AfterViewInit {
    @Input('icon-version') iconVersion: 'MaterialIcons' | 'MaterialSymbols' = 'MaterialSymbols';
    @Input() filled: boolean = false;
    @Input('icon-style') iconStyle: 'normal' | 'outlined' | 'rounded' | 'sharp' | 'two-tone' = 'normal';
    @Input('icon-size') iconSize: 48 | 36 | 24 | 18 = 24;
    @Input('bi-directional') biDirectional: boolean = false;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        let iconSize = 'md3-' + this.iconSize.toString();
        this.element.classList.add(iconSize);

        if (this.filled) {
            this.element.classList.add('md3-filled');
        }

        let iconStyle = this.iconStyle == 'normal' ? null : this.iconStyle;

        if (this.iconVersion == 'MaterialSymbols') {
            this.element.classList.add('md3-symbol');

            if (iconStyle == 'two-tone') {
                iconStyle = null;
            }
        }

        if (iconStyle !== null) {
            this.element.classList.add('md3-' + iconStyle);
        }

        if (this.biDirectional) {
            this.element.classList.add('md3-bi-directional');
        }
    }
}
