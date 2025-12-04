import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'button[md3-button]',
    imports: [],
    templateUrl: './button.html',
    styleUrl: './button.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class Button implements AfterViewInit {
    @Input() buttonSize: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' = 'small';
    @Input() buttonType: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' = 'filled';
    @Input() buttonSquared: boolean = false;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.classList.add(...[
            'md3-' + this.buttonSize,
            'md3-' + this.buttonType,
            ...(this.buttonSquared ? ['square'] : [])
        ]);
    }
}
