import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { StateComponent } from '../common/state-component';

@Directive({
    selector: 'label[md3-primary-action], button[md3-primary-action], a[md3-primary-action]',
    standalone: false,
    hostDirectives: [
        StateComponent
    ],
})
export class PrimaryAction implements AfterViewInit {
    constructor(private el: ElementRef) { }

    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }

    ngAfterViewInit(): void {
        this.nativeElement.setAttribute('tabindex', '0');
    }
}
