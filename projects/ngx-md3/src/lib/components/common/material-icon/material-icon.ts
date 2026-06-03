import { Component, ElementRef, input, booleanAttribute, effect } from '@angular/core';

@Component({
    selector: 'md3-icon',
    imports: [],
    templateUrl: './material-icon.html',
    styleUrl: './material-icon.scss',
    host: {
        '[class.md3-filled]': 'isFilled()',
        '[class.md3-bi-directional]': 'biDirectional()',
    },
})
export class MaterialIcon {
    public iconVersion = input<'MaterialIcons' | 'MaterialSymbols'>('MaterialSymbols', {
        alias: 'icon-version',
    });
    public isFilled = input<boolean, unknown>(false, {
        alias: 'filled',
        transform: booleanAttribute
    });
    public iconStyle = input<'normal' | 'outlined' | 'rounded' | 'sharp' | 'two-tone'>('normal', {
        alias: 'icon-style',
    });
    public iconSize = input<48 | 36 | 24 | 18>(24, {
        alias: 'icon-size',
    });
    public biDirectional = input<boolean, unknown>(false, {
        alias: 'bi-directional',
        transform: booleanAttribute
    });

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const iconSize = 'md3-' + this.iconSize().toString();
            this.element.classList.add(iconSize);

            onCleanup(() => {
                this.element.classList.remove(iconSize);
            });
        });

        effect((onCleanup) => {
            let iconStyle = this.iconStyle() == 'normal' ? null : this.iconStyle();

            if (this.iconVersion() == 'MaterialSymbols') {
                this.element.classList.add('md3-symbol');

                if (iconStyle == 'two-tone') {
                    iconStyle = null;
                }
            }

            if (iconStyle !== null) {
                this.element.classList.add('md3-' + iconStyle);
            }

            onCleanup(() => {
                this.element.classList.remove('md3-symbol', 'md3-' + iconStyle);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
