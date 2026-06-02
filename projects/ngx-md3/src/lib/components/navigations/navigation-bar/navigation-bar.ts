import { Component, computed, effect, ElementRef, inject } from '@angular/core';
import { LayoutService } from '../../../foundations/layout.service';

type NavigationLayout = 'vertical' | 'horizontal';

@Component({
    standalone: false,
    selector: 'md3-navigation-bar',
    templateUrl: './navigation-bar.html',
    styleUrl: './navigation-bar.scss',
})
export class NavigationBar {
    private readonly el = inject(ElementRef<HTMLElement>);
    private readonly layoutService = inject(LayoutService);
    private readonly resolvedLayout = computed<NavigationLayout>(() => {
        if (this.layoutService.widthClass() === 'compact') {
            return 'vertical';
        }

        return 'horizontal';
    });

    constructor() {
        effect((onCleanup) => {
            const layout = this.resolvedLayout();
            const layoutClass = 'md3-layout-' + layout;

            this.element.classList.add(layoutClass);

            onCleanup(() => {
                this.element.classList.remove(layoutClass);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
