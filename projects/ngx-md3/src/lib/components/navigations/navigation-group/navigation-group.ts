import { booleanAttribute, Component, ElementRef, inject, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'md3-nav-group',
    templateUrl: './navigation-group.html',
    styleUrl: './navigation-group.scss',
    host: {
        '[class.md3-hide-on-collapse]': 'this.hideOnCollapse()',
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
