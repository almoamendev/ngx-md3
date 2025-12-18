import { Directive } from '@angular/core';

@Directive({
    standalone: false,
    selector: '[md3-supporting-text]',
    host: {
        'class': 'md3-supporting-text'
    }
})
export class SupportingText {
}
