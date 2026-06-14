import { Component, input, signal, Signal } from '@angular/core';
import { ButtonContext, MD3_BUTTON_CONTEXT } from '../../../interfaces/button-context.interface';
import { TypeTitle } from '../../../styles/typography/type-title';
import { ButtonSize } from '../../../types/button-size.type';
import { IconButtonWidth } from '../../../types/icon-button-width.type';

@Component({
    selector: 'md3-side-sheet-header',
    imports: [
        TypeTitle
    ],
    templateUrl: './side-sheet-header.html',
    styleUrl: './side-sheet-header.scss',
    providers: [
        {
            provide: MD3_BUTTON_CONTEXT,
            useExisting: SideSheetHeader,
        },
    ],
})
export class SideSheetHeader implements ButtonContext {
    public title = input<string>('', {
        alias: 'title',
    });
    
    // context values
    buttonContextSize: Signal<ButtonSize> = signal("small");
    buttonContextWidth: Signal<IconButtonWidth> = signal("default");
}
