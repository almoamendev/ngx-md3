import { booleanAttribute, Component, effect, ElementRef, inject, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'md3-nav-group',
    templateUrl: './navigation-group.html',
    styleUrl: './navigation-group.scss',
})
export class NavigationGroup {
    private readonly el = inject(ElementRef<HTMLElement>);
    
    public label = input<string>();
    
    public hideOnCollapse = input<boolean, unknown>(false, {
        alias: 'hide-on-collapse',
        transform: booleanAttribute
    });

    constructor() {
        effect(() => {
            if (this.hideOnCollapse()) {
                this.element.classList.add('md3-hide-on-collapse');
            } else {
                this.element.classList.remove('md3-hide-on-collapse');
            }
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
