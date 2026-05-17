import { AfterContentInit, Component, ContentChildren, ElementRef, Input, QueryList } from '@angular/core';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';

@Component({
    selector: 'md3-button-group',
    standalone: false,
    templateUrl: './button-group.html',
    styleUrl: './button-group.scss',
    host: {
        'role': 'group',
    }
})
export class ButtonGroup implements AfterContentInit {
    @Input('button-size') buttonSize: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' = 'small';
    @Input() selection: 'none' | 'single' | 'multiple' = 'none';
    @Input('group-type') groupType: 'standard' | 'connected' = 'standard';
    
    @ContentChildren(Button, { descendants: true }) private buttons?: QueryList<Button>;
    @ContentChildren(IconButton, { descendants: true }) private iconButtons?: QueryList<IconButton>;

    constructor(private el: ElementRef) {
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    ngAfterContentInit(): void {
        this.element.classList.add(
            'md3-' + this.groupType,
            'md3-' + this.buttonSize
        );
        
        this.syncButtonSize();
    }

    public set size(value: typeof this.buttonSize) {
        if (this.buttonSize == value) {
            return;
        }
        
        this.element.classList.remove('md3-' + this.buttonSize);
        this.buttonSize = value;
        this.element.classList.add('md3-' + this.buttonSize);

        this.syncButtonSize();
    }

    private syncButtonSize() {
        this.buttons?.forEach((item) => {
            item.size = this.buttonSize;
        });

        this.iconButtons?.forEach((item) => {
            item.size = this.buttonSize;
        });
    }
}
