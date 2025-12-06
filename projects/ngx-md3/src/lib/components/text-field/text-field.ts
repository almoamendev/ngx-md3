import { Component, Input } from '@angular/core';

@Component({
    selector: 'md3-text-field',
    imports: [],
    templateUrl: './text-field.html',
    styleUrl: './text-field.scss',
})
export class TextField {
    @Input() label?: string;
    @Input() type: 'filled' | 'outlined' = 'filled';
}
