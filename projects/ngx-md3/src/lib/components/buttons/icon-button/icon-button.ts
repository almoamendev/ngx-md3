import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { ButtonSize } from '../../../types/button-size.type';

@Component({
    selector: 'button[md3-icon-button]',
    imports: [],
    templateUrl: './icon-button.html',
    styleUrl: './icon-button.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class IconButton implements AfterViewInit {
    @Input('button-size') buttonSize: ButtonSize = 'small';
    @Input('button-shape') buttonShape: 'round' | 'square' = 'round';
    @Input('button-type') buttonType: 'filled' | 'tonal' | 'outlined' | 'standard' = 'filled';
    @Input('button-width') buttonWidth: 'default' | 'narrow' | 'wide' = 'default';

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.classList.add(
            'md3-' + this.buttonSize,
            'md3-' + this.buttonShape,
            'md3-' + this.buttonType,
            'md3-' + this.buttonWidth,
        );
    }

    public set size(value: typeof this.buttonSize) {
        this.element.classList.remove('md3-' + this.buttonSize);
        this.buttonSize = value;
        this.element.classList.add('md3-' + this.buttonSize);
    }
}
