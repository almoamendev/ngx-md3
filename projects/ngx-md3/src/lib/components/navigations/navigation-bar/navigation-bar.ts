import { Component, computed, effect, ElementRef, inject } from '@angular/core';
import { LayoutService } from '../../../foundations/layout.service';

type NavigationLayout = 'vertical' | 'horizontal';

@Component({
    selector: 'md3-navigation-bar',
    imports: [
    ],
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
            const layout = 'md3-layout-' + this.resolvedLayout();
            this.element.classList.add(layout);

            onCleanup(() => {
                this.element.classList.remove(layout);
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement;
    }
}
