import { AfterViewInit, booleanAttribute, Component, computed, contentChild, Directive, effect, ElementRef, HostListener, input, Optional, signal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { StateComponent } from '../../common/state-component';
import { Checkbox } from '../../selection-controls/checkbox/checkbox';
import { RadioButton } from '../../selection-controls/radio-button/radio-button';
import { Switch } from '../../selection-controls/switch/switch';
import { List } from '../list';

@Directive({
    selector: 'button[md3-item-primary-action], a[md3-item-primary-action]',
    host: {
        'class': 'md3-item-primary-action',
    },
    hostDirectives: [
        StateComponent
    ],
})
export class ListItemPrimaryAction {
}

@Component({
    selector: 'md3-list-item, label[md3-list-item], button[md3-list-item], a[md3-list-item]',
    templateUrl: './list-item.html',
    styleUrl: './list-item.scss',
    host: {
        '[class.md3-selected]': 'isSelected()',
        '[class.draggable]': 'isDraggable()',
    },
    hostDirectives: [
        StateComponent,
        CdkDrag,
    ],
})
export class ListItem implements AfterViewInit {
    public slotsAlignment = input<'start' | 'center' | 'end'>('center', {
        alias: 'slots-alignment',
    });
    public selected = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });
    public dragDisabled = input<boolean, unknown>(false, {
        alias: 'drag-disabled',
        transform: booleanAttribute,
    });

    public isActionTag = signal<boolean>(false);
    private isLabelTag: boolean = false;
    private checkbox = contentChild(Checkbox);
    private radioButton = contentChild(RadioButton);
    private switch = contentChild(Switch);

    public isSelected = computed(() => {
        const checkbox = this.checkbox();
        const radioButton = this.radioButton();

        if (checkbox || radioButton) {
            return (checkbox?.state() || radioButton?.state()) === true;
        }

        return this.selected();
    });

    public isInputDisabled = computed(() => {
        return this.checkbox()?.isDisabled() || this.radioButton()?.isDisabled() || this.switch()?.isDisabled();
    });

    public isDraggable = computed(() => {
        return !!this.list?.draggable() && !this.dragDisabled() && !this.isInputDisabled();
    });

    constructor(
        private el: ElementRef,
        private state: StateComponent,
        private drag: CdkDrag,
        @Optional() private list: List | null
    ) {
        // Keep the preview inside the list so it inherits the list's tokens.
        this.drag.previewContainer = 'parent';

        effect((onCleanup) => {
            const alignment = 'md3-slots-alignment-' + this.slotsAlignment();
            this.element.classList.add(alignment);

            onCleanup(() => {
                this.element.classList.remove(alignment);
            });
        });

        effect(() => {
            this.element.classList.toggle('md3-disabled', !!this.isInputDisabled());
        });

        // Draggable items always need the state layer for the dragged state.
        effect(() => {
            this.state.setStateLayer(this.isDraggable() || (this.isActionTag() && !this.isInputDisabled()));
        });

        effect(() => {
            this.drag.disabled = !this.isDraggable();
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

        this.isActionTag.set(tagName != 'md3-list-item');
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
