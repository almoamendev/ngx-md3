import { booleanAttribute, Component, effect, ElementRef, input, Input, model, signal } from '@angular/core';
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
    public buttonSize = model<'small' | 'medium' | 'large'>('small', {
        alias: 'button-size',
    });
    public buttonType = model<FabType>('tonal-primary', {
        alias: 'button-type',
    });
    public isExtended = model<boolean>(false, {
        alias: 'extended',
    });

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const buttonSize = 'md3-' + this.buttonSize();
            this.element.classList.add(buttonSize);

            onCleanup(() => {
                this.element.classList.remove(buttonSize);
            });
        });

        effect((onCleanup) => {
            const buttonType = 'md3-' + this.buttonType();
            this.element.classList.add(buttonType);

            onCleanup(() => {
                this.element.classList.remove(buttonType);
            });
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
