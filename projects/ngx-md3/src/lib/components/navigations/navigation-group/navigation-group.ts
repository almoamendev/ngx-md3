import { booleanAttribute, Component, computed, ElementRef, inject, input } from '@angular/core';
import { TypeLabel } from '../../../../public-api';

@Component({
    selector: 'md3-nav-group',
    imports: [
        TypeLabel,
    ],
    templateUrl: './navigation-group.html',
    styleUrl: './navigation-group.scss',
    host: {
        '[class.md3-hide-on-collapse]': 'hideOnCollapse()',
        '[class.md3-show-on-collapse]': 'showOnCollapse()',
    },
})
export class NavigationGroup {
    private readonly el = inject(ElementRef<HTMLElement>);
    
    public label = input<string>();
    
    public collapseMode = input<'none' | 'hide' | 'show'>('none', {
        alias: 'collapse-mode'
    });

    public hideOnCollapse = computed<boolean>(() => this.collapseMode() == 'hide');
    public showOnCollapse = computed<boolean>(() => this.collapseMode() == 'show');

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
