import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';

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
    @Input() buttonSize: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' = 'small';
    @Input() buttonShape: 'round' | 'square' = 'round';
    @Input() buttonType: 'filled' | 'tonal' | 'outlined' | 'standard' = 'filled';
    @Input() buttonWidth: 'default' | 'narrow' | 'wide' = 'default';

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
}
