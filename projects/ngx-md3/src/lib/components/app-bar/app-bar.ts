import { booleanAttribute, Component, computed, contentChild, input, Signal, signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { ButtonSize } from '../../types/button-size.type';
import { Avatar } from '../common/avatar';

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
        '[class.md3-small]': "appBarType() === 'small'",
        '[class.md3-medium]': "appBarType() === 'medium'",
        '[class.md3-large]': "appBarType() === 'large'",
        '[class.md3-elevated]': 'elevated()',
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
    
    public elevated = input<boolean, unknown>(false, {
        alias: 'elevated',
        transform: booleanAttribute,
    });
    
    public centerAligned = input<boolean, unknown>(false, {
        alias: 'center-aligned',
        transform: booleanAttribute,
    });

    private avatar = contentChild(Avatar);

    public hasAvatar = computed(() => !!this.avatar());

    // button context
    public buttonContextSize: Signal<ButtonSize> = signal('small');
}
