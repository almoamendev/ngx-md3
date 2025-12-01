import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'md3-icon',
    imports: [],
    templateUrl: './material-icon.html',
    styleUrl: './material-icon.scss',
    host: {
        'class': 'material-icon'
    }
})
export class MaterialIcon {
    @Input() iconVersion: 'MaterialIcons' | 'MaterialSymbols' = 'MaterialSymbols';
    @Input() filled: boolean = false;
    @Input() iconStyle: 'normal' | 'outlined' | 'rounded' | 'sharp' | 'two-tone' = 'normal';
    @Input() iconSize: 48 | 36 | 24 | 18 = 24;
    @Input() biDirectional: boolean = false;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        if (this.iconSize != 24) {
            let iconSize = 'md-' + this.iconSize.toString();
            this.element.classList.add(iconSize);
        }

        if (this.filled) {
            this.element.classList.add('filled');
        }

        let iconStyle = this.iconStyle == 'normal' ? null : this.iconStyle;

        if (this.iconVersion == 'MaterialSymbols') {
            this.element.classList.add('symbol');

            if (iconStyle == 'two-tone') {
                iconStyle = null;
            }
        }

        if (iconStyle !== null) {
            this.element.classList.add(iconStyle);
        }

        if (this.biDirectional) {
            this.element.classList.add('bi-directional');
        }
    }
}
