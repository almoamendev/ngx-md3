import { booleanAttribute, Component, ElementRef, inject, input } from '@angular/core';
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
    },
})
export class NavigationGroup {
    private readonly el = inject(ElementRef<HTMLElement>);
    
    public label = input<string>();
    
    public hideOnCollapse = input<boolean, unknown>(false, {
        alias: 'hide-on-collapse',
        transform: booleanAttribute
    });

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
