import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'md3-divider'
})
export class Divider {
    @Input('type') type?: string;
}
