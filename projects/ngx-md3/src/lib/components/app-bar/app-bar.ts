import { booleanAttribute, Component, computed, contentChild, effect, ElementRef, input, Signal, signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { ButtonSize } from '../../types/button-size.type';
import { Avatar } from '../common/avatar';
import { LayoutService } from '../../foundations/layout.service';

export type AppBarType = 'small' | 'medium' | 'large';

@Component({
    standalone: false,
    selector: 'md3-app-bar',
    templateUrl: './app-bar.html',
    styleUrl: './app-bar.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: AppBar,
        },
    ],
    host: {
        role: 'banner',
        '[class.md3-scrolled]': 'mainIsScrolled()',
    },
})
export class AppBar implements ButtonContext {
    public title = input<string | null>(null, {
        alias: 'bar-title',
    });

    public subtitle = input<string | null>(null, {
        alias: 'bar-subtitle',
    });

    public appBarType = input<AppBarType>('small', {
        alias: 'bar-type',
    });
    
    public centerAligned = input<boolean, unknown>(false, {
        alias: 'center-aligned',
        transform: booleanAttribute,
    });

    private avatar = contentChild(Avatar);

    public hasAvatar = computed(() => !!this.avatar());

    public mainIsScrolled = computed(() => this.layout.mainIsScrolled());

    // button context
    public buttonContextSize: Signal<ButtonSize> = signal('small');

    constructor(
        private el: ElementRef,
        private layout: LayoutService
    ) {
        effect((onCleanup) => {
            this.element.classList.add('md3-' + this.appBarType());

            onCleanup(() => {
                this.element.classList.remove('md3-' + this.appBarType());
            });
        });
    }

    public get element(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }
}
