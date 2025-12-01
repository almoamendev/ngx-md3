import { Directive } from '@angular/core';

@Directive({
    selector: '[md3-icon-element]',
    host: {
        'class': 'md3-icon-element'
    }
})
export class IconElement {}
