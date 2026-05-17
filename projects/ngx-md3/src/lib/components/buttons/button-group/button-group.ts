import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';

@Component({
    selector: 'md3-button-group',
    imports: [],
    templateUrl: './button-group.html',
    styleUrl: './button-group.scss',
    host: {
        '[class]': '"md3-" + groupType',
        'role': 'group',
    }
})
export class ButtonGroup implements AfterContentInit {
    @Input('button-size') set buttonSize(value: typeof this.currentSize) {
        this.currentSize = value;

        this.buttons?.forEach((item) => {
            item.size = this.currentSize;
        });

        this.iconButtons?.forEach((item) => {
            item.size = this.currentSize;
        });
    }

    @Input() selection: 'none' | 'single' | 'multiple' = 'none';
    @Input('group-type') groupType: 'standard' | 'connected' = 'standard';
    
    @ContentChildren(Button, { descendants: true }) private buttons?: QueryList<Button>;
    @ContentChildren(IconButton, { descendants: true }) private iconButtons?: QueryList<IconButton>;

    private currentSize: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' = 'small';

    ngAfterContentInit(): void {
        this.buttonSize = this.currentSize;
    }
}
