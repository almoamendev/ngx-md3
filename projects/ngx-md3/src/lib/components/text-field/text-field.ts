import { AfterContentInit, Component, ContentChild, ElementRef, Input } from '@angular/core';
import { TextInput } from './text-input';

@Component({
    standalone: false,
    selector: 'md3-text-field',
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField implements AfterContentInit {
    @Input() label?: string;
    @Input() type: 'filled' | 'outlined' = 'filled';

    @ContentChild(TextInput) input?: TextInput;

    ngAfterContentInit(): void {
        if (this.input) {
            this.input.nativeElement.setAttribute('placeholder', '');
        }
    }
}
