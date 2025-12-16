import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[md3-icon-element]',
    host: {
        'class': 'md3-icon-element'
    }
})
export class IconElement {
    @Input('md3-icon-element') iconType?: string;
}
