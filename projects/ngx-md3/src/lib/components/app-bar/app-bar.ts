import { booleanAttribute, Component, input, Signal, signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../interfaces/button-context.interface';
import { ButtonSize } from '../../types/button-size.type';

export type AppBarType = 'small' | 'center-aligned' | 'medium' | 'large';

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
        '[attr.app-bar-type]': 'appBarType()',
        '[class.md3-small]': "appBarType() === 'small'",
        '[class.md3-center-aligned]': "appBarType() === 'center-aligned'",
        '[class.md3-medium]': "appBarType() === 'medium'",
        '[class.md3-large]': "appBarType() === 'large'",
        '[class.md3-elevated]': 'elevated()',
    },
})
export class AppBar implements ButtonContext {
    public appBarType = input<AppBarType>('small', {
        alias: 'app-bar-type',
    });
    
    public elevated = input<boolean, unknown>(false, {
        alias: 'elevated',
        transform: booleanAttribute,
    });

    public buttonContextSize: Signal<ButtonSize> = signal('small');
}
