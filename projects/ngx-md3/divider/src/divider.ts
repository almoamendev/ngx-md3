import { Directive, input } from '@angular/core';

@Directive({
    selector: 'md3-divider'
})
export class Divider {
    public dividerType = input<string | null>(null, {
        alias: 'type',
    });
}
