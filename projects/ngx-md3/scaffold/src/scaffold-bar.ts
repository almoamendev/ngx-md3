import { Directive, input } from '@angular/core';

@Directive({
    selector: '[md3-scaffold-bar]'
})
export class ScaffoldBar {
    public region = input.required<'top' | 'bottom'>({
        alias: 'md3-scaffold-bar',
    });
}
