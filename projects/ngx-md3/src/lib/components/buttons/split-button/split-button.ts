import { booleanAttribute, Component, effect, ElementRef, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonSize } from '../../../types/button-size.type';
import { SplitButtonType } from '../../../types/split-button-type.type';
import { StateComponent } from '../../common/state-component';
import { MaterialIcon } from '../../common/material-icon/material-icon';

@Component({
    selector: 'md3-split-button',
    imports: [
        StateComponent,
        MaterialIcon,
    ],
    templateUrl: './split-button.html',
    styleUrl: './split-button.scss',
    host: {
        'role': 'group',
    },
})
export class SplitButton {
    @Input('button-size') set size(value: ButtonSize) {
        this.buttonSize.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };
    @Input('button-type') set type(value: SplitButtonType) {
        this.buttonType.update((current) => {
            if (value == current) {
                return current;
            }

            this.element.classList.remove('md3-' + current);
            return value;
        });
    };

    @Input({ transform: booleanAttribute }) disabled: boolean = false;
    @Input({ alias: 'action-disabled', transform: booleanAttribute }) actionDisabled: boolean = false;
    @Input({ alias: 'menu-disabled', transform: booleanAttribute }) menuDisabled: boolean = false;
    @Input('action-type') actionType: 'button' | 'submit' | 'reset' = 'button';
    @Input('menu-label') menuLabel: string = 'Show more options';
    @Input('menu-expanded') menuExpanded: boolean | null = null;

    @Output() actionClick = new EventEmitter<MouseEvent>();
    @Output() menuClick = new EventEmitter<MouseEvent>();

    private buttonSize = signal<ButtonSize>('small');
    private buttonType = signal<SplitButtonType>('filled');

    constructor(private el: ElementRef) {
        effect(() => {
            this.element.classList.add('md3-' + this.buttonSize());
        });

        effect(() => {
            this.element.classList.add('md3-' + this.buttonType());
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    protected get isActionDisabled(): boolean {
        return this.disabled || this.actionDisabled;
    }

    protected get isMenuDisabled(): boolean {
        return this.disabled || this.menuDisabled;
    }

    protected onActionClick(event: MouseEvent): void {
        if (this.isActionDisabled) {
            event.preventDefault();
            return;
        }

        this.actionClick.emit(event);
    }

    protected onMenuClick(event: MouseEvent): void {
        event.stopPropagation();

        if (this.isMenuDisabled) {
            event.preventDefault();
            return;
        }

        this.menuClick.emit(event);
    }
}
