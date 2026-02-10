import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { StateComponent } from '../../common/state-component';

@Component({
    selector: 'button[md3-fab]',
    imports: [],
    templateUrl: './floating-action-button.html',
    styleUrl: './floating-action-button.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class FloatingActionButton implements AfterViewInit {
    @Input() buttonSize: 'small' | 'medium' | 'large' = 'small';
    @Input() buttonColor: 'tonal-primary' | 'tonal-secondary' | 'tonal-tertiary' | 'primary' | 'secondary' | 'tertiary' = 'tonal-primary';
    @Input() extendedFAB: boolean = false;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        this.element.classList.add(
            'md3-' + this.buttonSize,
            'md3-' + this.buttonColor,
            ...(this.extendedFAB ? ['md3-extended-fab'] : [])
        );
    }
}
