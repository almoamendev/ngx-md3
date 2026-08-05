import { Component, input, signal, Signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';
import { TypeTitle } from '../../../styles/typography/type-title';
import { ButtonSize } from '../../../types/button-size.type';
import { IconButtonWidth } from '../../../types/icon-button-width.type';

/**
 * Header of a full screen dialog: a leading icon button to leave the dialog,
 * the headline, and a trailing action. It sticks to the top of the dialog while
 * the content scrolls underneath.
 */
@Component({
    selector: 'md3-fullscreen-dialog-header',
    imports: [
        TypeTitle,
    ],
    templateUrl: './full-screen-dialog-header.html',
    styleUrl: './full-screen-dialog-header.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: FullScreenDialogHeader,
        },
    ],
})
export class FullScreenDialogHeader implements ButtonContext {
    public title = input<string>('', {
        alias: 'title',
    });

    // context values
    buttonContextSize: Signal<ButtonSize> = signal('small');
    buttonContextWidth: Signal<IconButtonWidth> = signal('default');
}
