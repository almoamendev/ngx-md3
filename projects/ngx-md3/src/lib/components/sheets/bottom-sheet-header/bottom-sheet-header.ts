import { Component, input, signal, Signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';
import { TypeTitle } from '../../../styles/typography/type-title';
import { ButtonSize } from '../../../types/button-size.type';
import { IconButtonWidth } from '../../../types/icon-button-width.type';

@Component({
    selector: 'md3-bottom-sheet-header',
    imports: [
        TypeTitle
    ],
    templateUrl: './bottom-sheet-header.html',
    styleUrl: './bottom-sheet-header.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: BottomSheetHeader,
        },
    ],
})
export class BottomSheetHeader implements ButtonContext {
    public title = input<string>('', {
        alias: 'title',
    });

    // context values
    buttonContextSize: Signal<ButtonSize> = signal("small");
    buttonContextWidth: Signal<IconButtonWidth> = signal("default");
}
