import { Component, ContentChild, ElementRef, Input, AfterViewInit, effect, signal, computed, contentChild, HostListener } from '@angular/core';
import { PrimaryAction } from '../primary-action';
import { StateComponent } from '../../common/state-component';
import { Checkbox } from '../../checkbox/checkbox';
import { RadioButton } from '../../radio-button/radio-button';

@Component({
    selector: 'md3-list-item, label[md3-list-item], button[md3-list-item], a[md3-list-item]',
    standalone: false,
    templateUrl: './list-item.html',
    styleUrl: './list-item.scss',
    hostDirectives: [
        StateComponent
    ],
})
export class ListItem implements AfterViewInit {
    @Input('slots-alignment') slotsAlignment: 'start' | 'center' | 'end' = 'center';
    @Input() set selected(value: boolean) {
        this.selectSignal.set(value);
    }
    
    @ContentChild(PrimaryAction) primaryAction?: PrimaryAction;

    public isActionTag: boolean = false;
    private isLabelTag: boolean = false;
    private checkbox = contentChild(Checkbox);
    private radioButton = contentChild(RadioButton);
    private selectSignal = signal<boolean>(false);
    private selectionControlSignal = computed(() => {
        if (this.checkbox() || this.radioButton()) {
            return (this.checkbox()?.state() || this.radioButton()?.state()) === true;
        }

        return this.selectSignal();
    });

    constructor(
        private el: ElementRef,
        private state: StateComponent
    ) {
        effect(() => {
            if (this.selectSignal()) {
                this.element?.classList.add('md3-selected');
            } else {
                this.element?.classList.remove('md3-selected');
            }
        });

        effect(() => {
            this.selected = this.selectionControlSignal();
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterViewInit(): void {
        let tagName = this.element.tagName.toLowerCase();

        this.isLabelTag = tagName == 'label';

        if (this.isLabelTag) {
            this.element.setAttribute('tabindex', '0');
            this.setLabelInputTabIndex();
        }

        this.isActionTag = tagName != 'md3-list-item';
        
        if (!this.isActionTag) {
            this.state.setStateLayer(false);
        }
    }

    @HostListener('focusin', ['$event'])
    protected onFocusIn(event: FocusEvent): void {
        if (!this.isLabelTag || event.target === this.element || !this.isInputElement(event.target)) {
            return;
        }

        this.focusLabel();
    }

    @HostListener('keydown', ['$event'])
    protected onKeyDown(event: KeyboardEvent): void {
        if (!this.isLabelTag || event.target !== this.element || event.defaultPrevented) {
            return;
        }

        if (event.key !== ' ' && event.key !== 'Enter') {
            return;
        }

        const input = this.getLabelActivationInput();

        if (!input) {
            return;
        }

        event.preventDefault();
        input.click();
        this.focusLabel();
    }

    private setLabelInputTabIndex(): void {
        this.getLabelInputs().forEach((input) => input.tabIndex = -1);
    }

    private getLabelActivationInput(): HTMLInputElement | undefined {
        return this.getLabelInputs().find((input) => {
            return !input.disabled && (input.type === 'checkbox' || input.type === 'radio');
        }) ?? this.getLabelInputs().find((input) => !input.disabled);
    }

    private getLabelInputs(): HTMLInputElement[] {
        return Array.from(this.element.querySelectorAll<HTMLInputElement>('input'));
    }

    private focusLabel(): void {
        this.element.focus({ preventScroll: true });
    }

    private isInputElement(target: EventTarget | null): target is HTMLInputElement {
        return target instanceof HTMLInputElement;
    }
}
