import { AfterContentInit, Component, ContentChild, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'md3-text-field',
    imports: [],
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField implements AfterContentInit {
    @Input() label?: string;
    @Input() type: 'filled' | 'outlined' = 'filled';

    @ContentChild('input') input?: ElementRef;

    ngAfterContentInit(): void {
        if (this.input) {
            this.input.nativeElement.classList.add('placeholder');
        }
    }
}
