import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { ButtonSize } from '../../../types/button-size.type';

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
    @Input('button-size') buttonSize: ButtonSize = 'small';
    @Input('button-type') buttonType: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' = 'filled';
    @Input('button-squared') buttonSquared: boolean = false;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.classList.add(
            'md3-' + this.buttonSize,
            'md3-' + this.buttonType,
            ...(this.buttonSquared ? ['md3-square'] : [])
        );
    }

    public set size(value: typeof this.buttonSize) {
        this.element.classList.remove('md3-' + this.buttonSize);
        this.buttonSize = value;
        this.element.classList.add('md3-' + this.buttonSize);
    }
}
