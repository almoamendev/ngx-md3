import { booleanAttribute, Component, effect, ElementRef, input, Input, signal } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { FabType } from '../../../types/fab-type.type';

@Component({
    selector: 'button[md3-fab]',
    imports: [],
    templateUrl: './floating-action-button.html',
    styleUrl: './floating-action-button.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class FloatingActionButton {
    @Input('button-size') set size(value: 'small' | 'medium' | 'large') {
        this.buttonSize.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };
    @Input('button-type') set type(value: FabType) {
        this.buttonType.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };

    public isExtended = input<boolean, unknown>(false, {
        alias: 'extended-fab',
        transform: booleanAttribute,
    });
    
    private buttonSize = signal<'small' | 'medium' | 'large'>('small');
    private buttonType = signal<FabType>('tonal-primary');

    constructor(private el: ElementRef) {
        effect(() => {
            this.element.classList.add('md3-' + this.buttonSize());
        });

        effect(() => {
            this.element.classList.add('md3-' + this.buttonType());
        });
        
        effect(() => {
            if (this.isExtended()) {
                this.element.classList.add('md3-extended-fab');
            } else {
                this.element.classList.remove('md3-extended-fab');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
