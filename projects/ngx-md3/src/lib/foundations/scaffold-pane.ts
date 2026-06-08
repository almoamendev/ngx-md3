import { CdkScrollable } from '@angular/cdk/scrolling';
import { Directive, effect, ElementRef, input, OnDestroy } from '@angular/core';
import { LayoutService } from './layout.service';

@Directive({
    selector: '[md3-scaffold-pane]',
    hostDirectives: [
        CdkScrollable,
    ],
})
export class ScaffoldPane implements OnDestroy {
    public role = input.required<'main' | 'start' | 'end'>({
        alias: 'md3-scaffold-pane',
    });

    constructor(
        private el: ElementRef,
        private layout: LayoutService
    ) {
        effect(() => {
            if (this.role() == 'main') {
                this.layout.registerMainPane(this.el.nativeElement);
            } else {
                this.layout.unregisterMainPane(this.el.nativeElement);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.role() == 'main') {
            this.layout.unregisterMainPane(this.el.nativeElement);
        }
    }
}
