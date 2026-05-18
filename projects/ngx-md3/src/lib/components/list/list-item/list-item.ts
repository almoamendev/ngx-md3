import { Component, ContentChild, ElementRef, Input, AfterViewInit, effect, signal, computed, contentChild } from '@angular/core';
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

        if (tagName == 'label') {
            this.element.setAttribute('tabindex', '0');
        }

        this.isActionTag = tagName != 'md3-list-item';
        
        if (!this.isActionTag) {
            this.state.setStateLayer(false);
        }
    }
}
