import { booleanAttribute, Component, computed, effect, ElementRef, inject, input } from '@angular/core';
import { StateComponent } from '../../common/state-component';
import { FabType } from '../../../types/fab-type.type';
import { MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';
import { FabSize } from '../../../types/fab-size.type';

@Component({
    selector: 'button[md3-fab], a[md3-fab]',
    imports: [],
    templateUrl: './floating-action-button.html',
    styleUrl: './floating-action-button.scss',
    host: {
        '[class.md3-extended-fab]': 'effectiveExtended()',
    },
    hostDirectives: [
        StateComponent
    ],
})
export class FloatingActionButton {
    private context = inject(MD3_BUTTON_CONTEXT, { optional: true });
    
    public buttonSize = input<FabSize>('small', {
        alias: 'button-size',
    });
    public buttonType = input<FabType>('tonal-primary', {
        alias: 'button-type',
    });
    public isExtended = input<boolean, unknown>(false, {
        alias: 'extended',
        transform: booleanAttribute,
    });

    public effectiveSize = computed(() => this.context?.buttonContextSize?.() ?? this.buttonSize());
    public effectiveExtended = computed(() => this.context?.buttonContextExtended?.() ?? this.isExtended());

    constructor(private el: ElementRef) {
        effect((onCleanup) => {
            const buttonSize = 'md3-' + this.effectiveSize();
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
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
