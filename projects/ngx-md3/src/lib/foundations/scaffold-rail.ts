import { Directive, input } from '@angular/core';

@Directive({
    selector: '[md3-scaffold-rail]'
})
export class ScaffoldRail {
    public region = input.required<'leading' | 'trailing'>({
        alias: 'md3-scaffold-rail',
    });
}
